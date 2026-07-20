import { AppDataSource } from '../db/datasource';
import { Logistics } from '../controllers/entity';

export interface CorridorLeaderboardItem {
  originState: string;
  destinationState: string;
  avgDelayHours: number;
  avgTempC: number;
}

export interface SeasonalityTrendItem {
  season: string;
  avgPricePerCrate: number;
}

export interface DashboardMetricsPayload {
  kpis: {
    totalFoodSavedKg: number;
    totalRevenueDeliveredNgn: number;
    platformSpoilageRatePercent: number;
  };
  corridorLeaderboard: CorridorLeaderboardItem[];
  seasonalityTrends: SeasonalityTrendItem[];
}

export class DashboardService {
  static async getDashboardSummary(): Promise<DashboardMetricsPayload> {
    const logisticsRepo = AppDataSource.getRepository(Logistics);

    // Run all complex aggregations concurrently for speed
    const [
      kpiData,
      revenueData,
      leaderboardData,
      seasonalityData
    ] = await Promise.all([
      
      // KPI 1 & 3: Total Food Saved & Platform Spoilage Rate
      logisticsRepo.createQueryBuilder('logistics')
        .select([
          'SUM(logistics.quantitySentKg * (0.3253 - (logistics.spoilageRatePercent / 100.0))) AS total_food_saved_kg',
          'AVG(logistics.spoilageRatePercent) AS avg_platform_spoilage_rate'
        ])
        .getRawOne(),

      // KPI 2: Total Revenue Delivered
      logisticsRepo.createQueryBuilder('logistics')
        .select('SUM(logistics.deliveredRevenueNgn)', 'total_revenue_delivered_ngn')
        .where('logistics.spoilageStatusLabel = :status', { status: 'Not Spoiled' })
        .getRawOne(),

      // Risk Map Corridor Leaderboard
      logisticsRepo.createQueryBuilder('logistics')
        .select([
          'logistics.originState AS "originState"',
          'logistics.destinationState AS "destinationState"',
          'AVG(logistics.checkpointDelayHours) AS avg_delay_hours',
          'AVG(logistics.averageTemperatureC) AS avg_temp_c'
        ])
        .groupBy('logistics.originState')
        .addGroupBy('logistics.destinationState')
        .orderBy('avg_delay_hours', 'DESC')
        .getRawMany(),

      // Market Seasonality Trends
      logisticsRepo.createQueryBuilder('logistics')
        .select([
          'logistics.season AS season',
          'AVG(logistics.pricePerCrateNgn) AS avg_price_per_crate'
        ])
        .groupBy('logistics.season')
        .getRawMany()
    ]);

    // Construct and return the unified payload, ensuring PostgreSQL strings map to TypeScript Numbers
    return {
      kpis: {
        totalFoodSavedKg: Number(kpiData?.total_food_saved_kg) || 0,
        totalRevenueDeliveredNgn: Number(revenueData?.total_revenue_delivered_ngn) || 0,
        platformSpoilageRatePercent: Number(kpiData?.avg_platform_spoilage_rate) || 0,
      },
      corridorLeaderboard: leaderboardData.map((item) => ({
        originState: item.originState, 
        destinationState: item.destinationState,
        avgDelayHours: Number(item.avg_delay_hours) || 0,
        avgTempC: Number(item.avg_temp_c) || 0,
      })),
      seasonalityTrends: seasonalityData.map((item) => ({
        season: item.season,
        avgPricePerCrate: Number(item.avg_price_per_crate) || 0,
      }))
    };
  }
}