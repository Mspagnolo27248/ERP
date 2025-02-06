import { NextFunction, Request, Response } from "express";
import { MasterDataCache } from "../../shared-common/data-cache/MasterDataCache";

export class AdminController {
  async refreshMasterData(req: Request, res: Response) {
    try {
      MasterDataCache.getInstance().invalidateAllCaches();
      res.json({ message: 'Master data cache refreshed successfully' });
    } catch (error) {
      res.status(500).json({ error: 'Failed to refresh master data cache' });
    }
  }
} 