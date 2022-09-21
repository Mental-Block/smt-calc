import { Request } from "express";
import { getRepository } from "typeorm";

import Settings from "@entities/settings";

import type { SettingProps } from "@interfaces/setting";

export default class SettingsController {

  private settingsRepository = getRepository(Settings);

  async save(req: Request<{}, {}, SettingProps>){
    try {
      const { id } = req.body

      const settings = await this.settingsRepository.findOneOrFail({id});

      if (!settings) throw "Wrong settings id."
    
      this.settingsRepository.merge(settings, req.body);
      
      await this.settingsRepository.save(settings);

      return true;
    } catch (error: any) {
      throw (error || "Failed to save settings.") 
    }
  }

  async all(){
    try {
      const settings = await this.settingsRepository.findOneOrFail({select: ['humidity', 'id', 'tempature']})
        
      return settings
    } catch (error: any) {
      throw (error || "Failed to get settings.") 
    }
  }
}