

import * as React from 'react';
import { Button, View, Text, Image,SafeAreaView,
  StyleSheet,
  ScrollView,} from 'react-native';
import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import  people    from './data/dataProvider';
import  Mymodal from './modal/modalRec'


class HomeScreen extends React.Component {
  
  
  
  

  

  render() {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <View>
          {people.map((person)=>(
          <Button key={person.id}
          title={person.first_name}
          onPress={() => this.props.navigation.navigate('Records',{id: person})}
        />))}
        
        </View>
      </View>
    );
  }
}

class DetailsScreen extends React.Component {
 
  

  render() {
    const {navigation} =this.props;
    const person = navigation.getParam('id')
    const modal= Mymodal;
    return (
      <ScrollView
          contentInsetAdjustmentBehavior="automatic"
          centerContent="true"
          contentContainerStyle={styles.container}
          >
      <View style={styles.container}>
        
        
        <View style={styles.actions} >
          {person.files.map((files)=>(
          <Button key={files.date}
          title={files.date+" "+files.time}
          onPress={() => this.props.navigation.navigate('Play',{id: person})}
        />
        ))}
        
        </View>
        
      </View>
      </ScrollView>
    );
  }
}

const RootStack = createStackNavigator(
  {
    Contactos: HomeScreen,
    Records: DetailsScreen,
    Play: Mymodal,
  },
  {
    initialRouteName: 'Contactos',
  
  defaultNavigationOptions: {
    headerStyle: {
      backgroundColor: '#f4511e',
    },
    headerTintColor: '#fff',
    headerTitleStyle: {
      fontWeight: 'bold',
    },
  },
}
);

const AppContainer = createAppContainer(RootStack);

export default class App extends React.Component {
  render() {
    return <AppContainer />;
  }
}

const styles = StyleSheet.create({
  
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  scroll: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
  },
  modal:{
    backgroundColor:"#00000099",
    flex:1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalContainer:{
    backgroundColor:"#f9fafb",
    width:"80%",
    borderRadius:5
  },
  modalHeader:{
    
  },
  title:{
    fontWeight:"bold",
    fontSize:20,
    padding:15,
    color:"#000"
  },
  divider:{
    width:"100%",
    height:1,
    backgroundColor:"lightgray"
  },
  modalBody:{
    backgroundColor:"#fff",
    paddingVertical:20,
    paddingHorizontal:10
  },
  modalFooter:{
  },
  actions:{
    borderRadius:5,
    marginHorizontal:10,
    paddingVertical:10,
    paddingHorizontal:20
  },
  actionText:{
    color:"#fff"
  }
});

