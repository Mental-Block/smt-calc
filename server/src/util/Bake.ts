/* 
    4.2 General Considerations for Baking The oven used for baking shall be vented and capable of maintaining the required
    temperatures at less than 5% RH.

    4.2.1 High Temperature Carriers Unless otherwise indicated by the manufacturer, SMD packages shipped in high temperature carriers can be baked in the carriers at 125°C.

    4.2.2 Low Temperature Carriers SMD packages shipped in low temperature carriers may not be baked in the carriers at
    any temperature higher than 40°C. If a higher bake temperature is required, SMD packages must be removed from the low
    temperature carriers to thermally safe carriers, baked, and returned to the low temperature carriers.

    4.2.7.1 Oxidation Risk Baking SMD packages may cause oxidation and/or intermetallic growth of the terminations, which
    if excessive can result in solderability problems during board assembly. The temperature and time for baking SMD packages are therefore limited by solderability considerations. Unless otherwise indicated by the supplier, the cumulative bake
    time at a temperature greater than 90°C and up to 125°C shall not exceed 96 hours. If the bake temperature is not greater
    than 90°C, there is no limit on bake time. Bake temperatures higher than 125°C are not allowed without consulting the
    supplier

    Bake Tables 4.1 and 4.2 were calculated using the following assumptions/approach:
    1. Assume Fickian 1-D diffusion and Henry’s Law apply:

    ∂C∂t = D ∂2C ∂x2 (Fick’s Law)

    CSat (@ surface) ∝ % RH in ambient atmosphere (Henry’s Law)
    Where C as a function of time (t) is:

    C(t) = CSat(1 − 4πΣn=0∞{ (−1)n(2n + 1)e −D (2n+1)2 π2 t / 4L2 })

    2. Diffusivity = 6.2 exp(-0.445eV/kT) mm2

    /s, (assumes slow diffusing mold compound)
    a. D30C = 2.48x10-7 mm2/s
    b. D40C = 4.27x10-7 mm2/s
    c. D90C = 4.13x10-6 mm2/s
    d. D125C = 1.44x10-5 mm2/s

    3. Define:
    a. Lcenterline = critical thickness, e.g., thickness of package / 2
    b. CCritical = concentration at Lcenterline for given MSL (based on 30°C/60% RH exposure + 24 hr MET preconditioning)
    c. CCenterline = concentration at Lcenterline for any exposure condition
    
    4. Impose following two exposure conditions:
    a. MSL + >72 hr exposure (assume saturated at 30°C/85% RH where CSat = 7.8 mg/cm3)
    b. MSL + ≤72 hr exposure (assume ambient at 30°C/60% RH where CSat = 5.3 mg/cm3)
    5. Calculate minimum time @ Bake temperature for cases 4a and 4b where an additional MSL exposure will keep CCenterline
    < CCritical.
*/

// import { MSL_LEVEL } from "@const"

// const MAXIMUM_TIME = 72 // hours
// const MINIMUM_TIME = 72 // hours

// export default class Bake {
//     constructor(){
//         this.time = 
//     }
// }