import React, { Component } from 'react';
import userImage from '../assets/ic_user.png';
import '../assets/userProfile.css';
import Buttons from './Buttons';
import loadingSvg from '../assets/loading.svg';
import firebase from '../firebase.js';
import '../assets/notfound.css';

export default class UserProfile extends Component {
  state = {
    username: this.props.match.params.username,
    name: '',
    avatar: userImage,
    links: {},
    primaryColor: '',
    secondaryColor: '',
    buttonType: '',
    backgroundType: '',
    backgroundColor: '',
    backgroundGradient: '',
    backgroundImage: '',
    socialLinks: [],
    notFound: false,
    loaded: false
  };

  componentDidMount() {
    const that = this;
    firebase
      .firestore()
      .collection('users')
      .where('username', '==', this.state.username)
      .get()
      .then(function(querySnapshot) {
        if (querySnapshot.empty) {
          that.setState({ notFound: true, loaded: true });
        } else {
          let userData = { ...querySnapshot.docs[0].data() };
          let orderedLinks = {};
          Object.keys(userData.links)
            .sort((a, b) => b - a)
            .forEach(key => {
              orderedLinks[key] = userData.links[key];
            });
          that.setState({ ...userData, links: orderedLinks, loaded: true });
        }
      });
  }

  render() {
    if (!this.state.loaded) {
      return (
        <main className="user-profile">
          <img className="loading" src={loadingSvg} alt="loading" />
        </main>
      );
    }

    if (this.state.notFound) {
      return (
        <div id="notfound">
          <div className="notfound">
            <div className="notfound-404">
              <h1>
                4<span>0</span>4
              </h1>
            </div>
            <p>The page you are looking for cannot be found.</p>
            <a href="/">home page</a>
          </div>
        </div>
      );
    }

    return (
      <main className="user-profile">
        <div className="user">
          <img src={this.state.avatar} alt="user" />
          <h2>{this.state.name}</h2>
        </div>
        <div className="user-buttons">
          {Object.entries(this.state.links).map(([key, link]) => {
            return <Buttons link={link} buttonType={this.state.buttonType} key={key} />;
          })}
        </div>
        <div className="user-socialLinks">
          {this.state.socialLinks.map(socialLink => (
            <a
              className={'user-social icon ' + socialLink.type}
              href={socialLink.link}
              key={socialLink.type}
            >
              {' '}
            </a>
          ))}
        </div>
      </main>
    );
  }
}
