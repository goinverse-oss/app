import _ from 'lodash';
import { factory } from 'factory-girl';


export const randomRelatedObjects = (
  parentType,
  relatedType,
  count = 10,
  minId = 1,
  maxId = 25,
) => factory.sequence(`${parentType}.${relatedType}`, () => (
  _.sampleSize(_.range(minId, maxId), _.random(count - 2, count + 2)).map(id => ({
    type: relatedType,
    id: `${id}`,
  }))
));

export const randomRelatedObject = (
  parentType,
  relatedType,
  minId = 1,
  maxId = 25,
) => factory.sequence(`${parentType}.${relatedType}`, () => (
  {
    type: relatedType,
    id: `${_.random(minId, maxId)}`,
  }
));
