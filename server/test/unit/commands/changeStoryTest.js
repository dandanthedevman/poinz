import {v4 as uuid} from 'uuid';
import {prepTwoUsersInOneRoomWithOneStory} from '../testUtils';

test('Should produce storyChanged event', async () => {
  const {processor, roomId, userIdOne, storyId} = await prepTwoUsersInOneRoomWithOneStory(
    'mySuperUser',
    'nice Story'
  );
  const commandId = uuid();
  return processor(
    {
      id: commandId,
      roomId,
      name: 'changeStory',
      payload: {
        storyId,
        title: 'NewTitle',
        description: 'New Description'
      }
    },
    userIdOne
  ).then(({producedEvents, room}) => {
    expect(producedEvents).toMatchEvents(commandId, roomId, 'storyChanged');

    const [storyChangedEvent] = producedEvents;

    expect(storyChangedEvent.payload).toMatchObject({
      storyId,
      title: 'NewTitle',
      description: 'New Description'
    });

    expect(room.stories[storyId].title).toEqual('NewTitle');
    expect(room.stories[storyId].description).toEqual('New Description');
  });
});

test('Users marked as excluded can still change stories', async () => {
  const {
    processor,
    roomId,
    userIdOne,
    storyId,
    mockRoomsStore
  } = await prepTwoUsersInOneRoomWithOneStory('mySuperUser', 'nice Story');

  mockRoomsStore.manipulate((room) => room.setIn(['users', userIdOne, 'excluded'], true));

  const commandId = uuid();
  return processor(
    {
      id: commandId,
      roomId,
      name: 'changeStory',
      payload: {
        storyId,
        title: 'NewTitle',
        description: 'New Description'
      }
    },
    userIdOne
  ).then(({producedEvents}) =>
    expect(producedEvents).toMatchEvents(commandId, roomId, 'storyChanged')
  );
});

describe('preconditions', () => {
  test('Should throw if room does not contain matching story', async () => {
    const {processor, roomId, userIdOne} = await prepTwoUsersInOneRoomWithOneStory(
      'mySuperUser',
      'nice Story'
    );

    return expect(
      processor(
        {
          id: uuid(),
          roomId,
          name: 'changeStory',
          payload: {
            storyId: 'some-unknown-story',
            title: 'NewTitle',
            description: 'New Description'
          }
        },
        userIdOne
      )
    ).rejects.toThrow('Cannot change unknown story some-unknown-story');
  });
});
