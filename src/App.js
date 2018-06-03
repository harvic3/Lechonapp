import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

import ListCandidates from './Components/ListCandidates';
import Vote from './Components/Vote';


import imgVargas from './Img/waist.svg';
import imgFajardo from './Img/sleep.svg';
import imgPetro from './Img/avocado.svg';
import imgCalle from './Img/dove.svg';
import imgDuque from './Img/pig.svg';


const candidatesObj = [
    { name: 'Vargas', image: imgVargas, votes: 0 },
    { name: 'Fajardo', image: imgFajardo, votes: 0 },
    {name: 'Petro', image: imgPetro, votes: 0 },
    { name: 'Calle', image: imgCalle, votes: 0 },
    { name: 'Duque', image: imgDuque, votes: 0 }
];

const jokers = [585970, 851254, 569693, 1810, 1856, 1984];

class App extends Component {
  constructor(props){
    super(props);
    this.state = {
      candidates: candidatesObj,
      jokers: jokers,
      usedJokers: [],
      giveAward: false, 
      giveName: '',  
      maxVotes: 20000000, 
      totalVotes: 0
    }
  }

  calculateLimit = (candidates, votes) => {
    const remaining = this.calculateRemainingVotes(this.calculateTotalVotes(candidates));
    const limit = remaining > votes * 10 ? votes * 3 : remaining;
    return Number(limit);
  }

  isPrimeNumber = (votes) => {
    for (let i=2; i < votes / 2; i++) {
      if (votes % i === 0) {
        return false;
      }  
    }
    return true;
  }
  
  giveAward = (candidates, name) => {
    debugger;
    const names = candidates.map(cand => (cand.name));
    const del = names.indexOf(name);
    names.splice(del, 1);
    const index = Math.floor(Math.random() * names.length) + 1;
    const nameInd =  Math.floor(Math.random() * names.length) + 1;
    if (nameInd === index){
      this.setState({giveAward: true, giveName: names[index - 1]});
      return names[index - 1];
    }
  }

  generateVotos= (name, votes, remainingVotes, candidates) => {
    debugger;
    let votesToReturn = Number(votes);
    let limit = this.calculateLimit(candidates, votes);
    let breakGive = true;
    let giveName = '';
    if (!this.state.giveAward){
      giveName = this.giveAward(candidates, name);
      breakGive = false;
    }

    if (!this.state.giveAward || (this.state.giveAward && !this.isPrimeNumber(votes))){  
      for (let ind=0; ind < candidates.length; ind++){
        if (candidates[ind].name !== name && candidates[ind].name !== giveName){
          const votesToSet = Math.floor(Math.random() * limit) + 1;
          limit = this.calculateLimit(candidates, votes);
          candidates[ind].votes += votesToSet;
        }      
      }
    }else{   
        votesToReturn = Math.floor(Math.random() * limit) + 0;
        if (votesToReturn < votes && votes * 2 < limit){
          votesToReturn = votes * 2;
        }
        for (let ind=0; ind < candidates.length; ind++){
          if(candidates[ind].name === this.state.giveName){
            candidates[ind].votes += Math.floor(Math.random() * votesToReturn) + 0;
          }
        }
    }

    if (breakGive && this.state.giveAward){
      this.setState({giveAward: false, giveName: ''});
    }
    remainingVotes = this.calculateRemainingVotes(this.calculateTotalVotes(candidates));
    if (votesToReturn > remainingVotes){
      votesToReturn = remainingVotes;
    }
    return votesToReturn;
  }

  calculateVotes = (name, votes, totalVotes, candidates) => {
    const jokers = [...this.state.jokers];    
    const usedJokers = [...this.state.usedJokers];
    const remainingVotes = this.calculateRemainingVotes(totalVotes);
    let votesToSet = Number(votes);
    const indexCandidate = candidates.findIndex(cand => cand.name === name);  
    const indexJoker = jokers.indexOf(votesToSet);
    const notExist = usedJokers.indexOf(votesToSet);

    if (indexJoker >= 0 && notExist < 0 && votesToSet !== 1){
      debugger;
      usedJokers.push(votesToSet);
      this.setState({usedJokers});
      if (votesToSet === 569693 && remainingVotes > 8000000){
        votesToSet = 7000000 + votesToSet;
      }else if (indexJoker >= 3 && remainingVotes > 200000){
        votesToSet = votesToSet * 100;          
      }else if (remainingVotes > 5000000){
        votesToSet = 4000000 + votesToSet;       
      }
    }else if (votesToSet !== 1){
      votesToSet = this.generateVotos(name, votesToSet, remainingVotes, candidates);
    }
    //Se resta 3 para el remate final
    if (votesToSet + totalVotes > this.state.maxVotes){
      votesToSet = this.setState.maxVotes - totalVotes - 3;
    }
    candidates[indexCandidate].votes += votesToSet;
    this.setState({candidates});
  }

  calculateTotalVotes = (candidates) => {
    let totalVotes = 0;
    for (let k = 0; k < candidates.length; k++){
      totalVotes += candidates[k].votes;
    }
    this.setState({totalVotes: totalVotes});
    return totalVotes;
  }

  calculateRemainingVotes = (totalVotos) => {
    return this.state.maxVotes - totalVotos;
  }
 
  whenVote = (name, votes) => {
    debugger;
    const candidates = [...this.state.candidates];      
    let totalVotes = this.calculateTotalVotes(candidates);
    if (totalVotes + Number(votes) > this.setState.maxVotes){
      alert(`Ojo, la cantidad máxima de votos es de 20 millones!`);
      return;
    }
    this.calculateVotes(name, votes, totalVotes, candidates);
    totalVotes = this.calculateTotalVotes(candidates);    
    if (totalVotes === this.setState.maxVotes){
      //lanzar ganaste o perdiste según el candidato y reiniciar.
      alert(`Terminó!!`);
    }
    console.log('Total votos: ', this.state.totalVotes);
  }
  
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Elecciones la Lechona</h1>
        </header>
        <div className="section-app">
          <ListCandidates candidates={this.state.candidates} />
          <Vote candidates={this.state.candidates} vote={this.whenVote} />
          <div hidden={this.state.totalVotes === 0} className="color-total" >
            <h3>Total Votos: {this.state.totalVotes} </h3>  
          </div> 
        </div>                 
      </div>
    );
  }
}

export default App;
