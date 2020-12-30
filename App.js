import React ,{useState,useEffect} from 'react';
import { View, Text, Button, StyleSheet, ActivityIndicator,Image, TouchableOpacity,AsyncStorage  } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { Ionicons, FontAwesome, Fontisto,MaterialIcons  } from "@expo/vector-icons";
import { FlatList} from 'react-native-gesture-handler';
const Drawer= createDrawerNavigator()
import { DataTable,Headline  } from 'react-native-paper';
const MyDrawer=()=>{
  return(
      <Drawer.Navigator drawerType="slide" >
          <Drawer.Screen 
              name='Home'
              component={Worldstat}
              options={({navigation})=>({
              drawerLabel:'WorldStatisticts',
              drawerIcon:()=><Fontisto name="world-o" size={24} color="blue" />,
              headerTintColor:'blue'        
              })} 
          />
          
          <Drawer.Screen
            name='stats by country'
            component={StackNavigator}
            options={{
              drawerLabel:'Stats by country',
              drawerIcon:()=><FontAwesome name="flag" size={24} color="gray" />
            }}
          />
          <Drawer.Screen
             name='favouite country'
             component={StackNavigator1}
             options={{
               drawerLabel:'favouite countries',
               drawerIcon:()=><MaterialIcons name="favorite" size={24} color="red" />
              }}
         />
      </Drawer.Navigator>
  )
}

const Stack=createStackNavigator()
const Worldstat=()=>{
    return (
        <Stack.Navigator>
          <Stack.Screen name ='WorldStatisticts' component={Worldstatistics}  />
      </Stack.Navigator>
    )
}

class Worldstatistics extends React.Component {
  constructor(navigation,route) {
    super(navigation,route);
    this.state = { isLoading: true,isLoading1: true };
  }
  componentDidMount() {
        this.props.navigation.setOptions({
          headerLeft: () => (
              <View style={{ paddingLeft: 10 }}>
                <Ionicons
                  name="md-menu"
                  size={32}
                  color="blue"
                  onPress={() => this.props.navigation.toggleDrawer()}
                />
              </View>
          )
        });
    this.getData();
    this.getPopulation();
  }

  getPopulation(){
    return fetch("https://world-population.p.rapidapi.com/worldpopulation", {
      "method": "GET",
      "headers": {
        "x-rapidapi-key": "49401becb9msh0cc96fca0bdcab0p1da1aejsne64553ea6f70",
        "x-rapidapi-host": "world-population.p.rapidapi.com"
	    }
    })
    .then(response => response.json())
        .then(responseJson => {
          this.setState(
            {
              isLoading1: false,
              population: responseJson.body.world_population,
            },
            function() {console.log("population",this.state.population)}
          );
        })
          .catch(error => {
            console.error(error);
          })
  }


  getData() {
    return fetch("https://covid-19-data.p.rapidapi.com/totals", {
	"method": "GET",
	"headers": {
		"x-rapidapi-key": "49401becb9msh0cc96fca0bdcab0p1da1aejsne64553ea6f70",
		"x-rapidapi-host": "covid-19-data.p.rapidapi.com"
	  }
  })
    .then(response => response.json())
    .then(responseJson => {
      this.setState(
        {
          isLoading: false,
          dataSource: responseJson,
        },
        function() {console.log("malik",this.state.dataSource)}
      );
    })
    .catch(error => {
      console.error(error);
    });
  }

  render() {
    if (this.state.isLoading || this.state.isLoading1 ) {
      return (
        <View style={{ flex: 1, padding: 20 }}>
          <ActivityIndicator size="large" color="blue" />
          <Text>Loading Data </Text>
        </View>
      );
    }
    return (
      <View style={styles.container}>
        <FlatList
          data={this.state.dataSource}
          keyExtractor={item => item.key}
          renderItem={({ item }) => (
      <DataTable>
        <DataTable.Header>
          <DataTable.Title>Title</DataTable.Title>
          <DataTable.Title T>Total no </DataTable.Title>
          <DataTable.Title >Persentage %</DataTable.Title>
        </DataTable.Header>

        <DataTable.Row>
          <DataTable.Cell>Confirmed</DataTable.Cell>
          <DataTable.Cell numeric>{item.confirmed} </DataTable.Cell>
          <DataTable.Cell numeric> {((item.confirmed/this.state.population)*100).toFixed(3)}%</DataTable.Cell>
        </DataTable.Row>

        <DataTable.Row>
          <DataTable.Cell>Critical:</DataTable.Cell>
          <DataTable.Cell numeric>{item.critical}</DataTable.Cell>
          <DataTable.Cell numeric>{((item.critical/item.confirmed)*100).toFixed(3)}%</DataTable.Cell>
        </DataTable.Row>

        <DataTable.Row>
          <DataTable.Cell> Deaths:</DataTable.Cell>
          <DataTable.Cell numeric>{item.deaths} </DataTable.Cell>
          <DataTable.Cell numeric>{((item.deaths/this.state.population)*100).toFixed(3)}%</DataTable.Cell>
        </DataTable.Row>

        <DataTable.Row>
          <DataTable.Cell>Recovered:</DataTable.Cell>
          <DataTable.Cell numeric>{item.recovered} </DataTable.Cell>
          <DataTable.Cell numeric> {((item.recovered/this.state.population)*100).toFixed(3)}%</DataTable.Cell>
        </DataTable.Row>

        <DataTable.Row>
          <DataTable.Cell>LastUpdate:</DataTable.Cell>
          <DataTable.Cell numeric>{item.lastUpdate}</DataTable.Cell>
        </DataTable.Row>

      </DataTable>
          )}
        />
      </View>
    );
  }
}

const StackNavigator=()=>{
  return (
    <Stack.Navigator 
        screenOptions={({ navigation }) => ({
          headerTintColor: 'blue',
          headerStyle: {
            backgroundColor: 'white'
          },
          headerLeft: () =>
            <View style={{ paddingLeft: 10 }}>
              <Ionicons name="arrow-back" size={24} color="black" onPress={() =>          navigation.goBack()} />
            </View>
        })
      }
    >
      <Stack.Screen name ='List of country from APi' component={ListofCountry}/>
      <Stack.Screen name='Description'component={Description} />
    </Stack.Navigator>
  )
}


const StackNavigator1=()=>{
  return (
    <Stack.Navigator 
        screenOptions={({ navigation }) => ({
        headerTintColor: 'blue',
        headerStyle: {
          backgroundColor: 'white'
        },
        headerLeft: () =>
          <View style={{ paddingLeft: 10 }}>
            <Ionicons name="arrow-back" size={24} color="black" onPress={() => navigation.goBack()} />
          </View>
      })
  }
     >
    <Stack.Screen name ='Favouite Country' component={FavouiteCountry}/>
    <Stack.Screen name='Description'component={Description} />
  </Stack.Navigator>
  )
}


const FavouiteCountry=({navigation,route})=>{
  const [getList,setList]=React.useState()

  useEffect(() => {
      LoadData()
  });

  const LoadData = async () => {
    console.log('Loading');
          // var keys = await AsyncStorage.getAllKeys();
          // console.log(keys);
        await  AsyncStorage.getItem('favouite').then(
            (value)=>{
                var itsarray=value.split(",");
                  console.log(itsarray);
                  console.log('Loading Done!');
                var list= itsarray.filter(item=>item != "null")
           console.log(list)
         //   setList(itsarray)
          setList(list)
            }
          )
     };

const removeItem=async(star)=>{
 var list= getList.filter(item=>item !=star)
  setList(list)
  var a=list.toString()
  await AsyncStorage.setItem('favouite', a); 
}

 const [estado, setEstado] = useState(false);
   const agregarFavoritos = () => {
    setEstado(!estado);
  };
    return(
      <View style={{ paddingTop: 30 }}>       
        <FlatList
          data={getList}
          renderItem={({ item }) => (
          <TouchableOpacity style={{flexDirection:'row'}} key={Math.random().toString()}             activeOpacity={0.6}  onPress={()=>navigation.navigate('Description',{name:item})} >
          <View  style={styles.scrollItem}>
            <Text style={{fontSize:30}}>{item=="null" ? '' :item}</Text>
            <TouchableOpacity key={Math.random().toString()} onPress={() => { 
              //agregarFavoritos();          
            estado==false ? removeItem(item):'' }}>
              <Ionicons
                name={estado ?"star-outline" : "star-sharp"}
                size={30}
                color="red"
              />
            </TouchableOpacity>
          </View>         
        </TouchableOpacity>      
          )}
        />
      </View>
    )
}





class ListofCountry extends React.Component {

  constructor({navigation,route}) {
    super({navigation,route});
    this.state = { 
      isLoading: true,
      navigation: this.props.navigation
     };
  }
  navigation=this.props.navigation
  componentDidMount() {
    this.getData();
  }

  getData() {
    return fetch("https://world-population.p.rapidapi.com/allcountriesname", {
      "method": "GET",
      "headers": {
        "x-rapidapi-key": "49401becb9msh0cc96fca0bdcab0p1da1aejsne64553ea6f70",
        "x-rapidapi-host": "world-population.p.rapidapi.com"
      }
    })
      .then(response => response.json())
      .then(responseJson => {
        this.setState(
          {
            isLoading: false,
            dataSource: responseJson,
          },
          function() { console.log(this.state.dataSource) }
        );
      })
      .catch(error => {
        console.error(error);
      });
  }

  render() {
    if (this.state.isLoading) {
      return (
        <View style={{ flex: 1, padding: 20 }}>
          <ActivityIndicator size="large" color="blue" />
          <Text>Loading Data ...</Text>
        </View>
      );
    }

    return (
      <View style={ styles.scrollItem}>
        <FlatList
          data={this.state.dataSource.body.countries}
          keyExtractor={item =>Math.random().toString()}
          renderItem={({ item }) => (
          <TouchableOpacity 
            key={Math.random().toString()}   
            onPress={()=>this.props.navigation.navigate('Description',{name:item})}
            >
              <View style={{flexDirection: "row", padding: 10, borderBottomWidth: 1, borderColor: 'blue'}}>
                <View style={{ paddingLeft: 50, paddingRight: 10 }}>
                  <Text> {item}</Text>
                </View>
              </View>
          </TouchableOpacity>         
          )}
        />
      </View>
    );
  }
}


const Description=({navigation,route})=>{
  const [getname,setname]=useState('')
  const [isLoading, setLoading] = React.useState(true);
  const [dataSource, setDataSource] = React.useState([]);
  const [getPopulationSource,  setPopulationSource] = React.useState([]);
  const [getList,setList]=React.useState([])
  const list=[]
  const [estado, setEstado] = useState(false);
  const [isLoading1, setLoading1] = React.useState(true);
  var a= true
  var update=0
  // string=""
  const agregarFavoritos = () => {
    setEstado(!estado);
  };

      navigation.setOptions({
            headerLeft: () => (
                <View style={{ paddingLeft: 10 }}>
                  <Ionicons
                    name="arrow-back-outline"
                    size={32}
                    color="blue"
                    onPress={() => {navigation.goBack('ListofCountry')}} 
                  />
                </View>
            )
    });




  useEffect(()=>{      
    navigation.setOptions({
      headerRight: () => (
          <View>
        <TouchableOpacity onPress={() => { agregarFavoritos();
        
        estado==false ? addItem():'' }}>
          <Ionicons
            name={estado ?"star-sharp" : "star-outline"}
            size={30}
            color="red"
          />
        </TouchableOpacity>
      </View>
      )
    });
  })


  React.useEffect(() => {
    setname(route.params.name)
  },'');
  


  React.useEffect(() => {
    let per=LoadData()       
  },'');


  React.useEffect(() => {
    getData(route.params.name) 
    getCountryPopulation(route.params.name)
  },[]);


  const addItem=async()=>{
    const value = await AsyncStorage.getItem('favouite');
    await AsyncStorage.setItem('favouite', value+","+getname); 

  }


 const LoadData = async () => {
    console.log('Loading');
    // var keys = await AsyncStorage.getAllKeys();
    // console.log(keys);
     var item = await AsyncStorage.getItem('favouite');
    //  item=JSON.parse(item)
     console.log(item);
     console.log('Loading Done!');    
     return (item)
  };



const getCountryPopulation=(name)=>{
      fetch(`https://world-population.p.rapidapi.com/population?country_name=${name}`, {
        "method": "GET",
        "headers": {
          "x-rapidapi-key": "49401becb9msh0cc96fca0bdcab0p1da1aejsne64553ea6f70",
          "x-rapidapi-host": "world-population.p.rapidapi.com"
        }
      })
      .then((response) => response.json())
      .then((responseJson) => {
        setLoading1(false);
        setPopulationSource(responseJson.body.population);
        console.log(responseJson.body.population)
      })
      .catch((error) => {
        console.error(error);
    });  
}

const getData = (name) => {
  fetch(`https://covid-19-data.p.rapidapi.com/report/country/name?date=2020-04-01&name=${name}`, {
      "method": "GET",
      "headers": {
        "x-rapidapi-key": "49401becb9msh0cc96fca0bdcab0p1da1aejsne64553ea6f70",
        "x-rapidapi-host": "covid-19-data.p.rapidapi.com"
      }
    })
      .then((response) => response.json())
      .then((responseJson) => {
        setLoading(false);
        setDataSource(responseJson);
        console.log(responseJson)
      })
      .catch((error) => {
        console.error(error);
      });
  };

  if (isLoading || isLoading1 ) {
    return (
      <View style={{ flex: 1, padding: 20 }}>
        <ActivityIndicator size="large" color="blue" />
        <Text>Loading Data...</Text>
      </View>
    );
  }
  return (
    <View style={{ paddingTop: 30 }}>
     <Headline>{getname}</Headline>
      <FlatList
        data={dataSource}
        renderItem={({ item }) => (
            <DataTable>
              <DataTable.Header>
                <DataTable.Title>Title</DataTable.Title>
                <DataTable.Title T>Total no of cases</DataTable.Title>
                <DataTable.Title >Persentage %</DataTable.Title>
              </DataTable.Header>

              <DataTable.Row>
                <DataTable.Cell>Confirmed</DataTable.Cell>
                <DataTable.Cell numeric>{item.provinces['0'].confirmed} </DataTable.Cell>
                <DataTable.Cell numeric>  {(((item.provinces['0'].confirmed)/getPopulationSource)*100).toFixed(5)}%</DataTable.Cell>
              </DataTable.Row>

              <DataTable.Row>
                <DataTable.Cell>Active:</DataTable.Cell>
                <DataTable.Cell numeric>{item.provinces['0'].active}</DataTable.Cell>
                <DataTable.Cell numeric></DataTable.Cell>
              </DataTable.Row>

              <DataTable.Row>
                <DataTable.Cell> Deaths:</DataTable.Cell>
                <DataTable.Cell numeric>{item.provinces['0'].deaths}  </DataTable.Cell>
                <DataTable.Cell numeric>{(((item.provinces['0'].deaths)/item.provinces['0'].confirmed)*100).toFixed(5)}%</DataTable.Cell>
              </DataTable.Row>

              <DataTable.Row>
                <DataTable.Cell>Recovered:</DataTable.Cell>
                <DataTable.Cell numeric>{item.provinces['0'].recovered} </DataTable.Cell>
                <DataTable.Cell numeric> {(((item.provinces['0'].recovered)/item.provinces['0'].confirmed)*100).toFixed(5)}%</DataTable.Cell>
              </DataTable.Row>

            </DataTable>
        )}
      />
    </View>
  );
}


export default function App() {
  return (
    <NavigationContainer>
      <MyDrawer />
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#ecf0f1',
    padding: 12,
  },
  text:{
    padding:12,
    color:'blue',
    marginHorizontal:20,
    backgroundColor:'white',
    textAlign:"center"

  },
    scrollItem:{
    backgroundColor:'white',
    width:'90%',
    alignSelf:'center',
    margin:20,
    flexDirection:'row',
    justifyContent:"space-between"
  },
});
