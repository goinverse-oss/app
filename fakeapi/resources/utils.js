import _ from 'lodash';
import { factory } from 'factory-girl';


export const randomRelatedObjects = (
  parentType,
  relatedType,
  count = 3,
  minId = 1,
  maxId = 5,
) => factory.sequence(`${parentType}.${relatedType}`, () => (
  _.sampleSize(_.range(minId, maxId), count).map(id => ({
    type: relatedType,
    id: `${id}`,
  }))
));
