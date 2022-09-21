import { MSL_STATUS, TIME } from "@const"
import { TDateISO } from "@interfaces/date"
import { MSLLevelType } from "@interfaces/msl"


//  TABLE 5-1
const MSL_FLOOR_LIFE: Record<MSLLevelType, number>  = {
  '1': 365 * 100, // Unlimited at ≤30°C/85% RH 
  '2': 360, // 360 days
  '2a': 28, // 28 days
  '3': 7,  // 7 days
  '4': 3, // 3 days
  '5': 2, // 2 days
  '5a': 1, // 1 day
  '6': 0, // Now
}

/* 
     Table 7-1 lists equivalent derated floor
    lives for humidities ranging from 5-90% RH for temperatures of 20°C, 25°C, 30°C and 35°C. This table is applicable to
    SMDs molded with novolac, biphenyl or multifunctional epoxy mold compounds. The following assumptions were used in
    calculating Table 7-1:
    1. Activation Energy for diffusion =35eV (smallest known value).
    2. For ≤60% RH, use Diffusivity = 0.121exp (- 0.35eV/kT) mm2/s (this uses smallest known Diffusivity @ 30°C).
    3. For >60% RH, use Diffusivity = 1.320exp (- 0.35eV/kT) mm2/s (this uses largest known Diffusivity @ 30°C).
*/


export default class FloorLifeClock {
  private _mslLevel: MSLLevelType

  constructor(mslLevel:  MSLLevelType){
    this._mslLevel = mslLevel
  }

  private get _floorLifeTime(){
      const MS_CONVERTION_TO_DAY = (1000 * 60 * 60 * 24) 
      
      return (MSL_FLOOR_LIFE[this._mslLevel] * MS_CONVERTION_TO_DAY)
  }

  private get _exposureTimeModifier(){
        const X5 = 5
        const X10 = 10
  
          switch (this._mslLevel) {
            case '2':
              return X5
            case '2a':
              return X5
            case '3':
              return X5
            case '4': 
              return X10
            case '5': 
            return X10
            case '5a': 
              return X10
            default:
              return X10
        }
  }
  
  private get _allowableExposureTime(){
        switch (this._mslLevel) { 
          case '2':
            return TIME.TWELVE_HOURS
          case '2a':
            return TIME.TWELVE_HOURS
          case '3':
            return TIME.TWELVE_HOURS
          case '4': 
            return TIME.EIGHT_HOURS
          case '5': 
          return TIME.EIGHT_HOURS
          case '5a': 
            return TIME.EIGHT_HOURS
          default:
            return TIME.NOW
      }
  }  

  private _remainingExposureTime (time: TDateISO): number {
    const CURRENT_TIME = new Date().getTime()
    const TIME_LFET = new Date(time).getTime()
    const TIME = TIME_LFET - CURRENT_TIME

    return TIME 
  }
  
  private _currentUpdateTime (updateTime: TDateISO): number {
    const CURRENT_TIME = new Date().getTime()
    const UPDATE_TIME = new Date(updateTime).getTime()
    const TIME = CURRENT_TIME - UPDATE_TIME

    return TIME
  }

  private _currentExposureTime(time: TDateISO): number {
    const TIME_LEFT = new Date(time).getTime()
    const CURRENT_TIME = new Date().getTime()
    const FLOOR_LIFE_TIME = this._floorLifeTime
    const TIME = CURRENT_TIME - (TIME_LEFT - FLOOR_LIFE_TIME)

    return TIME
  }

  private _recoveringIntoExpiring (recoveryTime: TDateISO): number {
    const CURRENT_RECOVER_TIME  = this._remainingExposureTime(recoveryTime)
    const EXPOSURE_MODIFIRE = this._exposureTimeModifier
    const TIME = CURRENT_RECOVER_TIME / EXPOSURE_MODIFIRE 
  
    return TIME
  }

  private _expiringIntoRecovering(availableAt: TDateISO): number { 
      const CURRENT_EXPOSURE_TIME = this._currentExposureTime(availableAt)
      const EXPOSURE_MODIFIRE = this._exposureTimeModifier
      const TIME =  EXPOSURE_MODIFIRE * CURRENT_EXPOSURE_TIME

      return TIME
  }

  private _updateTimeDifference (updatedAt: TDateISO): number{
    const CURRENT_UPDATE_TIME = this._currentUpdateTime(updatedAt)
    const EXPOSURE_MODIFIRE = this._exposureTimeModifier
    const TIME = CURRENT_UPDATE_TIME / EXPOSURE_MODIFIRE

    return TIME
  }
  
  /**
   * 
   * @param time
   * The current floor life time 
   * @returns 
   */

  getStatus(time: TDateISO): Omit<keyof typeof MSL_STATUS, 'EXPIRING' | 'EXPIRED'> {
      const REMAINING_EXPOSURE_TIME = this._remainingExposureTime(time)
      const CURRENT_EXPOSURE_TIME = this._currentExposureTime(time)
      const ALLOWABLE_EXPOSURE_TIME = this._allowableExposureTime
    // const FLOOR_LIFE_TIME = this._floorLifeTime

    if(CURRENT_EXPOSURE_TIME <= TIME.NOW) {
      return MSL_STATUS.RECOVERED
    }
    
    if(CURRENT_EXPOSURE_TIME <= ALLOWABLE_EXPOSURE_TIME && REMAINING_EXPOSURE_TIME >= TIME.NOW){
      return MSL_STATUS.RECOVERING
    }
    
    // if(CURRENT_EXPOSURE_TIME >= ALLOWABLE_EXPOSURE_TIME && CURRENT_EXPOSURE_TIME <= FLOOR_LIFE_TIME){
      return MSL_STATUS.PAUSED
    // }    

    // if (REMAINING_EXPOSURE_TIME >= TIME.NOW){
    // return MSL_STATUS.EXPIRING
    // }

    // return EXPIRED
  }  

  /**
   * 
   * @returns creates a new floor life time to expire
   */

  createExpireDate(): TDateISO {
      const NEW_DATE = new Date()
      const TODAY = NEW_DATE.getDate()
      const FLOOR_LIFE = TODAY + MSL_FLOOR_LIFE[this._mslLevel]
      const EXPIRE_DATE = NEW_DATE.setDate(FLOOR_LIFE)

      return new Date(EXPIRE_DATE).toISOString() as TDateISO
  }

  /**
   * 
   * @param status 
   * The current status of the item
   * @param time 
   * The current floor life time
   * @returns 
   * 
   * new Time
   * 
   */

  pause (status: Omit<keyof typeof MSL_STATUS, 'EXPIRING' | 'EXPIRED'>, time: TDateISO): TDateISO  {
    // const EXPIRING = time
    // const EXPIRED = FloorLifeClock.convertdateToIsodate(Date.now())
    const PAUSED = time
    const RECOVERD = this.createExpireDate()
    const RECOVERING = () => {
      const CURRENT_TIME = Date.now()
      const RECOVERY_TIME = this._expiringIntoRecovering(time)
      const TIME = CURRENT_TIME + RECOVERY_TIME

      return FloorLifeClock.dateToIsodate(TIME)
    } 
    
    switch (status) {
      // case 'EXPIRING': 
      // return EXPIRING
      // case 'EXPIRED':
      //   return EXPIRED
      case 'PAUSED':
        return PAUSED
      case 'RECOVERED':
        return RECOVERD
      case 'RECOVERING': 
      return RECOVERING()
      default:
        throw new Error('valid status not provided')
    }
  }


/**
 * 
 * unPauses the floor life clock. Meaning you are trying to "expire" the current floor life
 * 
 * @param prevStatus 
 * previous status. Don't get a new status using getStatus methood
 * @param time 
 * The current floor life time
 * @param updateTime 
 * Time between the last request to the server was for this particular item
 * @returns 
 * 
 * new Time
 * 
 */
  unPause (prevStatus: Omit<keyof typeof MSL_STATUS, 'EXPIRING' | 'EXPIRED'>, time: TDateISO, updateTime: TDateISO) {
    // const EXPIRING = time
    // const EXPIRED = FloorLifeClock.convertdateToIsodate(Date.now())
    const RECOVERD = this.createExpireDate()
    const PAUSED = () => {
      const UPDATED_TIME = this._currentUpdateTime(updateTime)
      const CURRENT_TIME = new Date(time).getTime() + UPDATED_TIME
      
      return FloorLifeClock.dateToIsodate(CURRENT_TIME)
    }
    const RECOVERING = () => {
      const EXPIRE_TIME = this._recoveringIntoExpiring(time)
      const UPDATED_TIME = this._updateTimeDifference(updateTime)
      const EXPOSURE_TIME = FloorLifeClock.dateToIsodate(EXPIRE_TIME - UPDATED_TIME)
      
      const NEW_EXPIRE_TIME = this._currentExposureTime(EXPOSURE_TIME)

      return FloorLifeClock.dateToIsodate(NEW_EXPIRE_TIME)
    }

    switch (prevStatus) {
      // case 'EXPIRING': 
      // return EXPIRING
      // case 'EXPIRED':
      //   return EXPIRED
      case 'PAUSED':
        return PAUSED()
      case 'RECOVERED':
        return RECOVERD
      case 'RECOVERING': 
      return RECOVERING()
      default:
        throw new Error('valid status not provided')
    }
  }
  
  static dateToIsodate (date: number | Date ): TDateISO {
    return new Date(date).toISOString() as TDateISO 
  }

  /**
   * FOR INTERNAL TESTING
   * @param t 
   * Takes in a number in ms. Date.getTime()
   * @returns 
   * readable clock dd:hh:mm string
   */
  private _testClockDHM(t: number){
      var cd = 24 * 60 * 60 * 1000,
          ch = 60 * 60 * 1000,
          d = Math.floor(t / cd),
          h = Math.floor( (t - d * cd) / ch),
          m = Math.round( (t - d * cd - h * ch) / 60000),
          pad = function(n: any){ return n < 10 ? '0' + n : n; };
    if( m === 60 ){
      h++;
      m = 0;
    }
    if( h === 24 ){
      d++;
      h = 0;
    }
    return [d, pad(h), pad(m)].join(':')
  }
}
