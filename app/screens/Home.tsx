import { StyleSheet, Text, View } from 'react-native'
import React from 'react'

const Home = () => {
    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Text style={{fontSize:20, color:'#123c6e', fontWeight:'bold'}}>To View My Task, go to the Dashboard Tab.</Text>
        </View>
    )
}

export default Home

const styles = StyleSheet.create({})