import { arrayMove } from '@dnd-kit/sortable';
import _ from 'lodash';

// returns [newList, newListOrder, changes, OPTIONAL: newRank]
// newRank needed for lists to set selectedListItem
const afterDrop = ({ active, over }, list, indexVar, ranked = false) => {
  if (!over) return [[], [], false];
  if (active.id === over.id) return [[], [], false];

  if (!ranked) return simpleDrop(active, over, list, indexVar);
  return rankedDrop(active, over, list, indexVar);
}

const getOrder = (list, indexVar) => {
  let newOrder = [];
  list.forEach(i => newOrder.push(i[indexVar].toString()));
  return newOrder;
}

const getIndexes = (active, over, list, indexVar) => {
  const oldIndex = list.findIndex(i => i[indexVar] === parseInt(active.id));
  const newIndex = list.findIndex(i => i[indexVar] === parseInt(over.id));
  return [oldIndex, newIndex];
}

const simpleDrop = (active, over, list, indexVar) => {
  let newList = _.cloneDeep(list);
  const [oldIndex, newIndex] = getIndexes(active, over, list, indexVar);

  newList = arrayMove(newList, oldIndex, newIndex);
  const newOrder = getOrder(newList, indexVar);
  return [newList, newOrder, true];
}

const rankedDrop = (active, over, list, indexVar) => {
  const [oldIndex, newIndex] = getIndexes(active, over, list, indexVar);
  let newList = [];
  // dragged item rank decreasing
  if (oldIndex < newIndex) {
    list.forEach((i, index) => {
      if (index > newIndex) newList.push({ ...i });
      if (index < oldIndex) newList.push({ ...i });
      if (index === oldIndex) newList.push({ ...i, rank: newIndex + 1 });
      if (index <= newIndex && index > oldIndex)
        newList.push({ ...i, rank: index });
    });
  }
  // dragged item rank increasing
  if (oldIndex > newIndex) {
    list.forEach((i, index) => {
      if (index < newIndex) newList.push({ ...i });
      if (index > oldIndex) newList.push({ ...i });
      if (index === oldIndex) newList.push({ ...i, rank: newIndex + 1 });
      if (index >= newIndex && index < oldIndex)
        newList.push({ ...i, rank: index + 2 });
    });
  }

  newList.sort((a, b) => (a.rank > b.rank ? 1 : -1));
  const newOrder = getOrder(newList, indexVar);
  return [newList, newOrder, true, parseInt(newIndex + 1)];
}

export {
  afterDrop,
  getOrder,
}