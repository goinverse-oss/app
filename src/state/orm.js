import { ORM } from 'redux-orm';
import models from './models';

const orm = new ORM();
orm.register(...Object.values(models));

export default orm;
