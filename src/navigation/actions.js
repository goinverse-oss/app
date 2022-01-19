import { CommonActions } from '@react-navigation/native';

/**
 * Return an action that navigates to the specified item's screen.
 *
 * To be used with the .navigate method of a navigation prop
 * or NavigationService.
 *
 * @param {object} navigation nav object from navigator
 * @param {object} item object with 'type' and 'id' keys:
 *   type: one of ['podcastEpisode', 'meditation', or 'liturgyItem']
 *   id: Contentful ID (sys.id) of the entry
 * @returns {object} navigation action
 */
export function openItem(item, { fromList } = {}) {
  const collectionScreens = {
    podcastEpisode: 'Podcasts',
    meditation: 'Meditations',
    liturgyItem: 'Liturgies',
  };
  const instanceScreens = {
    podcastEpisode: 'SinglePodcastEpisode',
    meditation: 'SingleMeditation',
    liturgyItem: 'SingleLiturgyItem',
  };
  const routeParamNames = {
    podcastEpisode: 'episode',
    meditation: 'meditation',
    liturgyItem: 'liturgyItem',
  };
  if (fromList) {
    return CommonActions.navigate({
      name: instanceScreens[item.type],
      params: {
        [routeParamNames[item.type]]: item,
      },
    });
  }

  return CommonActions.navigate({
    name: collectionScreens[item.type],
    params: {
      screen: instanceScreens[item.type],
      params: {
        [routeParamNames[item.type]]: item,
      },
    },
  });
}
