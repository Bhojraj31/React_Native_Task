import { PixelRatio, StyleSheet, Text } from 'react-native'
import React from 'react'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { IconButton } from 'react-native-paper';
import Home from '../screens/Home';
import Dashboard from '../screens/Dashboard';
import MyRequest from '../screens/MyRequest';
import Settings from '../screens/Settings';

const Bottom = createBottomTabNavigator();
// ------ React Native Funcational Export Component with styles------
const BottomNav = () => {
    // ------ Used ActiveColor and InactiveColor Here ------
    const ActiveColor = '#123c6e';
    const InactiveColor = '#818181';

    // ------ Return react native component here ------
    return (
        // ------ Bottom Tab navigation here ------
        <Bottom.Navigator
            initialRouteName='Main'
            screenOptions={{
                tabBarLabelStyle: {
                    fontSize: 14,
                    marginTop:5,
                    fontWeight: '400',
                },
                tabBarStyle: {
                    backgroundColor: '#fff',
                    height:60,
                    paddingVertical: 10,
                    paddingBottom: 5,
                    borderTopWidth:1,
                    borderTopColor:'#818181',
                    elevation:1
                },
                tabBarActiveTintColor: '#123c6e',
                tabBarInactiveTintColor: '#818181'
            }}>
            {/* ------ Bottom Tab navigation Screens here ------ */}
            <Bottom.Screen
                name='Home'
                component={Home}
                options={({ }) => ({
                    headerShown: false,
                    tabBarIcon: ({ focused, color }) => (
                        <IconButton icon="home-outline" size={focused ? 25 : 22} iconColor={focused ? ActiveColor : InactiveColor} />
                    ),
                })}
            />
            <Bottom.Screen
                name='Dashboard'
                component={Dashboard}
                options={({ }) => ({
                    headerShown: false,
                    tabBarIcon: ({ focused, color }) => (
                        <IconButton icon="dots-grid" size={focused ? 25 : 22} iconColor={focused ? ActiveColor : InactiveColor} />
                    ),
                })}
            />
            <Bottom.Screen
                name='My Request'
                component={MyRequest}
                options={({ }) => ({
                    headerShown: false,
                    tabBarIcon: ({ focused, color }) => (
                        <IconButton icon="badge-account-outline" size={focused ? 25 : 22} iconColor={focused ? ActiveColor : InactiveColor} />
                    ),
                })}
            />
            <Bottom.Screen
                name='Settings'
                component={Settings}
                options={({ }) => ({
                    headerShown: false,
                    tabBarIcon: ({ focused, color }) => (
                        <IconButton icon="cog-outline" size={focused ? 25 : 22} iconColor={focused ? ActiveColor : InactiveColor} />
                    ),
                })}
            />
        </Bottom.Navigator>
    )
}

export default BottomNav

const styles = StyleSheet.create({})