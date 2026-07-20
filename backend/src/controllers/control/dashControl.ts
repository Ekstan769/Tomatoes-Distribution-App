import { Request, Response } from "express;
import { AppDataSource } from "../../db/datasource";

const BASELINE_LOSS_RATE = 0.3253;
const TABLE = "logistic_records";

function safeNumber(value: unknown, fallback =0): number {
    if (value === null || value === undefined) return fallback;
    const n = Number(value);
    return Number.isNaN(n) ? fallback : n;
}

async function getTotalFoodSavedKg(): Promise<number> {
    const result = await AppDataSource.query(
        `SELECT COALESCE(SUM(quantity_sent_kg * ($1 - (spoilage_rate_percent / 100))), 0) AS total
        FROM ${TABLE}`,
        [BASELINE_LOSS_RATE]
   );
   return safeNumber(result[0]?.total);
}
async function getTotalRevenueDeliveredNgn(): Promise<number> {
    const result = await AppDataSource.query(
        `SELECT COALESCE(SUM(delivered_revenue_ngn), 0) AS total
        FROM ${TABLE}
        WHERE spoilage_status_label = $1`,
        ["Not Spoiled"]
    );
    return safeNumber(result[0]?.total);    
}

async function getPlatformSpoilageRate(): Promise<number> {
    const result = await AppDataSource.query(
        `SELECT COALESCE(AVG(spoilage_rate_percent), 0) AS avg FROM ${TABLE}`
    );
    return safeNumber(result[0]?.avg);
}

async function getRiskCorridorLeaderboard() {
    const rows = await AppDataSource.query(
        `SELECT
            origin_state AS "originState",
            destination_state AS "destinationState",
            COALESCE(AVG(checkpoint_delay_hours), 0) AS "avgCheckpointDelayHours",
            COALESCE(AVG(average_temperature_c), 0) AS "avgTemperatureC"
        FROM ${TABLE}
        GROUP BY origin_state, destination_state
        ORDER BY "avgCheckpointDelayHours" DESC`
    );
    return rows .map((row: any) => ({
        origin_state: row.originState ?? "Unknown",
        destination_state: row.destinationState ?? "Unknown",
        avg_checkpoint_delay_hours: Number(safeNumber(row.avgCheckpointDelayHours).toFixed(2)),
        avg_temperature_c: Number(safeNumber(row.avgTemperatureC).toFixed(2)),
    }));
}

async function getMarketSeasonalityTrends() {
    const rows = await AppDataSource.query(
        `SELECT
            season,
            COALESCE(AVG(price_per_crate_ngn), 0) AS "avgPricePerCrateNgn"
        FROM ${TABLE}
        GROUP BY season`
    );
    return rows.map((row: any) => ({
        season: row.season ?? "Unknown",
        avg_price_per_crate_ngn: Number(safeNumber(row.PricePerCrateNgn).toFixed(2)),
    }));
}

export async function getCoreKpisHandler(req: Request, res: Response) {
    try {
        const [totalFoodSavedKg, totalRevenueDeliveredNgn, platformSpoilageRatePercent] =
        await Promise.all([
            getTotalFoodSavedKg(),
            getTotalRevenueDeliveredNgn(),
            getPlatformSpoilageRate(),
        ]);

        res.status(200).json({
            total_food_saved_kg: Number(totalFoodSavedKg.toFixed(2)),
            total_revenue_delivered_ngn: Number(totalRevenueDeliveredNgn.toFixed(2)),
            platform_spoilage_rate_percent: Number(platformSpoilageRatePercent.toFixed(2)),
        });
    } catch (error: any) {
        res.status(500).json({ message: "Failed to load KPI data", error: error.messge });
    }
}

export async function getRiskCorridorHandler(req: Request, res: Response) {
    try {
        const data = await getRiskCorridorLeaderboard();
        res.status(200).json(data);
    } catch (error: any) {
        res.status(500).json({ message: "Failed to load risk corridor data", error: error.message });
    }
}

export async function getMarketSeasonalityHandler(req: Request, res: Response) {
    try {
        const data = await getMarketSeasonalityTrends();
        res.status(200).json(data);
    } catch (error: any) {
        res.status(500).json({ message: "Failed to load market seasonality data", error: error.message });
    }
}