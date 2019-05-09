export function openItem(navigation, item) {
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
  navigation.navigate({
    routeName: routes[item.type],
    params: {
      [routeParamNames[item.type]]: item,
    },
  });
}
