import React from 'react';
import { View, Text, Image, TextInput, ScrollView, StyleSheet } from 'react-native';

const locationData = [
  {
    id: 1,
    name: 'Hospital',
    icon: require('./assets/hospital-icon.png'), 
    hours: 'Open 24 hours',
    distance: '0.5 km',
  },
  {
    id: 2,
    name: 'Police Station',
    icon: require('./assets/police-icon.png'), 
    hours: 'Open 24 hours',
    distance: '0.8 km',
  },
  {
    id: 3,
    name: 'Fire Station',
    icon: require('./assets/fire-station-icon.png'), 
    hours: 'Open 24 hours',
    distance: '1.5 km',
  },
];

const Maps = () => {
  return (
    <View style={styles.container}>
      {/* Title */}
      <View style={styles.titleContainer}>
        <Text style={styles.titleText}>Maps</Text>
      </View>

      {/* Map Image and Location Callout */}
      <View style={styles.mapContainer}>
        <Image
          source={require('./assets/map-screenshot.png')} 
          style={styles.mapImage}
          resizeMode="cover"
        />
        <View style={styles.callout}>
          <Text style={styles.calloutText}>Gambir, DKI Jakarta</Text>
        </View>
      </View>

      {/* Search Bar */}
      <View style={styles.searchBarContainer}>
        <TextInput
          style={styles.searchBarInput}
          placeholder="Search location"
          placeholderTextColor="#666"
        />
        {/*  Add a search icon here */}
      </View>

      {/* Location List */}
      <ScrollView style={styles.listContainer}>
        {locationData.map((location) => (
          <View key={location.id} style={styles.listItem}>
            <View style={styles.listItemImageContainer}>
                <Image source={location.icon} style={styles.listItemIcon} />
            </View>
            <View style={styles.listItemDetails}>
              <Text style={styles.listItemName}>{location.name}</Text>
              <Text style={styles.listItemHours}>{location.hours}</Text>
              <Text style={styles.listItemLink}>Details</Text>
            </View>
            <View style={styles.listItemDistanceContainer}>
                {/* Add a pin icon here if you like */}
                <Text style={styles.listItemDistance}>{location.distance}</Text>
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    width: '100%',
  },
  titleContainer: {
    paddingTop: 50,
    paddingBottom: 20,
    borderBottomWidth: 3,
    borderBottomColor: '#a12b2b',
    width: '100%',
    alignItems: 'center',
  },
  titleText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#a12b2b',
    textDecorationLine: 'underline',
  },
  mapContainer: {
    marginVertical: 20,
    alignItems: 'center',
    position: 'relative',
    width: '90%',
    aspectRatio: 2, 
  },
  mapImage: {
    width: '100%',
    height: '100%',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#000',
  },
  callout: {
    position: 'absolute',
    top: '30%', 
    left: '40%', 
    backgroundColor: '#fff',
    paddingVertical: 5,
    paddingHorizontal: 15,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: '#ccc',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 3,
  },
  calloutText: {
    fontSize: 14,
    color: '#333',
  },
  searchBarContainer: {
    width: '80%',
    marginBottom: 20,
  },
  searchBarInput: {
    height: 40,
    borderColor: '#000',
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: 20,
    fontSize: 14,
  },
  listContainer: {
    width: '90%',
    marginBottom: 100, 
  },
  listItem: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    padding: 15,
    marginBottom: 15,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: '#ccc',
    alignItems: 'center',
  },
  listItemImageContainer: {
    width: 60,
    height: 60,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  listItemIcon: {
    width: 40,
    height: 40,
  },
  listItemDetails: {
    flex: 1,
  },
  listItemName: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 2,
  },
  listItemHours: {
    fontSize: 14,
    color: '#a12b2b',
    marginBottom: 5,
  },
  listItemLink: {
    fontSize: 14,
    color: '#333',
    textDecorationLine: 'underline',
  },
  listItemDistanceContainer: {
    alignItems: 'flex-end',
    justifyContent: 'flex-start',
    position: 'absolute',
    top: 15,
    right: 15,
  },
  listItemDistance: {
    fontSize: 14,
    color: '#a12b2b',
  },
});

export default Maps;