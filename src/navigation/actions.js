export function openItem(navigation, item) {
  const routes = {
    podcastEpisode: 'SinglePodcastEpisode',
    meditation: 'SingleMeditation',
  };
  const routeParamNames = {
    podcastEpisode: 'episode',
    meditation: 'meditation',
  };
  navigation.navigate({
    routeName: routes[item.type],
    params: {
      [routeParamNames[item.type]]: item,
    },
  });
}
