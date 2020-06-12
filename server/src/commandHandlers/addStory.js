import {v4 as uuid} from 'uuid';

/**
 * A user adds a story to the estimation backlog of the room
 */
const addStoryCommandHandler = {
  fn: (room, command) => {
    const newStoryId = uuid();

    room.applyEvent('storyAdded', {
      ...command.payload,
      id: newStoryId,
      estimations: {},
      createdAt: Date.now()
    });

    if (!room.get('stories') || !room.get('stories').first()) {
      // this is the first story that gets added
      room.applyEvent('storySelected', {storyId: newStoryId});
    }
  }
};

export default addStoryCommandHandler;
