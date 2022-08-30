import { Request } from "express";
import { getRepository } from "typeorm";

import Settings from "@entities/settings";

import { SettingProps } from "@interfaces/setting";

type SaveRequest = Request<{}, {}, SettingProps>

export default class SettingsController {

  private settingsRepository = getRepository(Settings);

  async save(req: SaveRequest){
    const { id } = req.body

    const settings = await this.settingsRepository.findOneOrFail({id});
  
    this.settingsRepository.merge(settings, req.body);
    
    await this.settingsRepository.save(settings);

    return true;
  }

  async all(){
    const settings = await this.settingsRepository.findOneOrFail({select: ['humidity', 'id', 'tempature']})
    
    return settings
  }
}

