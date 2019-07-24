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
export function openItem(item) {
  const routes = {
    podcastEpisode: 'SinglePodcastEpisode',
    meditation: 'SingleMeditation',
    liturgyItem: 'SingleLiturgyItem',
  };
  const routeParamNames = {
    podcastEpisode: 'episode',
    meditation: 'meditation',
    liturgyItem: 'liturgyItem',
  };
  return {
    routeName: routes[item.type],
    params: {
      [routeParamNames[item.type]]: item,
    },
  };
}
