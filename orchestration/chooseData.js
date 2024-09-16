import vomEmergency from '../data/vomEmergency.json';
import { configs } from '../configs/configs';
function transformEmergencyType(type) {
  const mapping = configs.mappingForVom
  return mapping[type] || type;
}

export function transformData(data) {
  const transformedType = transformEmergencyType(data.emergencyType);
  
  const result = {};
  
  for (const key in vomEmergency) {
    if (transformedType in vomEmergency[key]) {
      result[key] = vomEmergency[key][transformedType];
    }
  }

  
  return result;
}