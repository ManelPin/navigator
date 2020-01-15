

import * as React from 'react';
import { Button, View, Text, Image} from 'react-native';
import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import  people    from './data/dataProvider'


class HomeScreen extends React.Component {
  
  
  
  

  

  render() {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <View>
          {people.map((person)=>(
          <Button key={person.id}
          title={person.first_name}
          onPress={() => this.props.navigation.navigate('Details',{id: person})}
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
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Text>Details Screen</Text>
        
        <View>
          {person.files.map((files)=>(
          <Button key={files.date}
          title={files.date+" "+files.time}
          onPress={() => this.props.navigation.navigate('Details',{itemId: person.id})}
        />))}
        
        </View>
        <Button
          title="Go back"
          onPress={() => this.props.navigation.goBack()}
        />
      </View>
    );
  }
}

const RootStack = createStackNavigator(
  {
    Home: HomeScreen,
    Details: DetailsScreen,
  },
  {
    initialRouteName: 'Home',
  
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

