'use strict';

import React, {Component} from 'react';
import {AppRegistry, StyleSheet, Text, Image, View, ListView} from 'react-native';
import { Actions } from 'react-native-router-flux';

import ChallangeCard from '../components/ChallangeCard';
import PlaceholderCard from '../components/PlaceholderCard';
import LifeMeter from '../components/LifeMeter';

import rUpdate from 'react-addons-update';
import styles from '../styles/ChallangeViewStyle';
import config from '../config';

export default class MyCards extends Component{
    constructor(props) {
        super(props);
        this.state = {
            loaded: false,
            gameInfo: null,
            gameInfoLoaded: false,
            isPlaying: false,

            // challanger
            challangerStats: null,
            challangerCardOne: false,
            challangerCardTwo: false,
            challangerCardThree: false,

            challangerCardOneType: null,
            challangerCardTwoType: null,
            challangerCardThreeType: null,

            // opponent
            opponentStats: null,
            opponentCardOne: false,
            opponentCardTwo: false,
            opponentCardThree: false,

            opponentCardOneType: null,
            opponentCardTwoType: null,
            opponentCardThreeType:null,
        };
    }

    componentWillMount() {
        //this.props.data
        //    .emit('lobby', { test: true, mes: 'in challange room' });
        this.gameInfo();
    }

    gameInfo(){
        this.props.data
            .on('gameInfo', (gameInfo) => {
                console.log(gameInfo);
                if(!this.state.gameInfoLoaded){
                    this.setState({
                        gameInfo,
                        gameInfoLoaded: true,
                        challangerStats: gameInfo.challange.props,
                        opponentStats: gameInfo.challange.props
                    });
                }
            });
    }

    addToActiveCards(cardType){
        if(!this.state.challangerCardOne){
            this.setState({
                challangerCardOne: true,
                challangerCardOneType: cardType
            });
        } else if(!this.state.challangerCardTwo){
            this.setState({
                challangerCardTwo: true,
                challangerCardTwoType: cardType
            });
        } else if(!this.state.challangerCardThree){
            this.setState({
                challangerCardThree: true,
                challangerCardThreeType: cardType
            });
        }else{
            return;
        }
        this.updateChallangerStats(
            this.getPropertyByCardType(cardType), false, 1);
    }

    removeFromActiveCards(pos, cardType){
        if(pos === 0 && this.state.challangerCardOne){
            this.setState({
                challangerCardOne: false,
                challangerCardOneType: null
            });
        } else if(pos === 1 && this.state.challangerCardTwo){
            this.setState({
                challangerCardTwo: false,
                challangerCardTwoType: null
            });
        } else if(pos === 2 && this.state.challangerCardThree){
            this.setState({
                challangerCardThree: false,
                challangerCardThreeType: null
            });
        }

        this.updateChallangerStats(
            this.getPropertyByCardType(cardType), true, 1);
    }

    getPropertyByCardType(cardType){
        switch (cardType) {
            case 0:
                return 'attackCards';
            case 1:
                return 'healCards';
            case 2:
                return 'blockCards';
            default:

        }
    }

    updateChallangerStats(propertyToChange, remove, nr){
        if(this.state.challangerStats[propertyToChange] <= 0 && !remove){
            return;
        }
        let newState = rUpdate(this.state, {
            challangerStats: { [propertyToChange]: {$set: (remove ? this.state.challangerStats[propertyToChange] +nr : this.state.challangerStats[propertyToChange] -nr)} }
        });
        this.setState(newState);
    }

    // props: { maxLife: 100, blockCards: 4, attackCards: 4, healCards: 4 },
    render() {
        if (!this.state.gameInfoLoaded) {
            return this.renderLoadingView();
        }

        return (
            <View style={styles.container}>
                <View style={styles.opponentCards}>
                        <ChallangeCard margin={4} shadow={true} render={true} type={0} nr={this.state.opponentStats.attackCards}/>
                        <ChallangeCard margin={4} shadow={true} render={true} type={1} nr={this.state.opponentStats.healCards}/>
                        <ChallangeCard margin={4} shadow={true} render={true} type={2} nr={this.state.opponentStats.blockCards}/>
                </View>


                <View style={styles.activeCards}>
                    <View style={styles.opponentPlaceCards}>
                        <PlaceholderCard>
                            <ChallangeCard render={this.state.opponentCardOne} type={this.state.opponentCardTOneType} renderX={this.state.isPlaying} />
                        </PlaceholderCard>

                        <PlaceholderCard>
                            <ChallangeCard render={this.state.opponentCardTwo} type={this.state.opponentCardTwoType} renderX={this.state.isPlaying} />
                        </PlaceholderCard>

                        <PlaceholderCard>
                            <ChallangeCard render={this.state.opponentCardThree} type={this.state.opponentCardThreeType} renderX={this.state.isPlaying} />
                        </PlaceholderCard>
                    </View>


                    <View style={styles.challangerPlaceCards}>
                        <PlaceholderCard>
                            <ChallangeCard render={this.state.challangerCardOne} type={this.state.challangerCardOneType} onClick={this.removeFromActiveCards.bind(this, 0)} />
                        </PlaceholderCard>

                        <PlaceholderCard>
                            <ChallangeCard render={this.state.challangerCardTwo} type={this.state.challangerCardTwoType} onClick={this.removeFromActiveCards.bind(this, 1)} />
                        </PlaceholderCard>

                        <PlaceholderCard>
                            <ChallangeCard render={this.state.challangerCardThree} type={this.state.challangerCardThreeType} onClick={this.removeFromActiveCards.bind(this, 2)} />
                        </PlaceholderCard>
                    </View>
                </View>


                <View style={styles.challangerCards}>
                    <ChallangeCard margin={4} shadow={true} render={true} onClick={this.addToActiveCards.bind(this)} type={0} nr={this.state.challangerStats.attackCards}/>
                    <ChallangeCard margin={4} shadow={true} render={true} onClick={this.addToActiveCards.bind(this)} type={1} nr={this.state.challangerStats.healCards}/>
                    <ChallangeCard margin={4} shadow={true} render={true} onClick={this.addToActiveCards.bind(this)} type={2} nr={this.state.challangerStats.blockCards}/>
                </View>

            </View>
        ); // <LifeMeter />
    }

    renderLoadingView() {
      return (
        <View>
          <Text>
              Setting up challange...
          </Text>
        </View>
      );
    }
}
