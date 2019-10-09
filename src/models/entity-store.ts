import { IEntity } from "./entity";

interface IEntityStore<T extends IEntity> {
  list: T[];
  byId: Record<string, T>;
}

export class EntityStore<T extends IEntity> implements IEntityStore<T> {
  list: T[];
  byId: Record<string, T>;
  constructor() {
    this.list = [];
    this.byId = {};
  };

  public initialize(entities: T[]) {
    if (this.list.length) {
      throw Error('Would not expect to initialize a non-empty store');
    }
    this.list = [];
    this.byId = {};
    for (const entity of entities) {
      this.list.push(entity)
      this.byId[entity.id] = entity;
    }
    return this;
  }

  public add(entity: T) {
    this.list = [...this.list, entity];
    this.byId = {...this.byId};
    this.byId[entity.id] = entity;
    return this;
  }

  public modify(id, entityPartial: Partial<T>) {
    const newList = [];
    let newItem;
    for (const item of this.list) {
      if (item.id === id) {
        newItem = {...item, ...entityPartial}
        newList.push(newItem);
      } else {
        newList.push(item);
      }
    }
    this.list = newList;
    this.byId = {...this.byId};
    this.byId[id] = newItem
  }

  public remove(id: string) {
    const newList = [];
    for (const item of this.list) {
      if (item.id !== id) {
        newList.push(item);
      }
    }
    this.list = newList;
    this.byId = {...this.byId};
    delete this.byId[id];
    return this;
  }

  public reset() {
    this.list = [];
    this.byId = {};
    return this;
  }

}