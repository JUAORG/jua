/* eslint-disable */
import React, { Component } from 'react'
import ReactGA from 'react-ga';
import {
  serviceRequestUserActions,
  submitActiveServiceRequestAction
} from '../../../actions/JuaNetwork'

class JitsiComponent extends Component {

  domain = process.env.REACT_APP_JITSI_DOMAIN;
  api = {}

  constructor(props) {
    super(props)
    this.state = {
      room: window.location.search.slice(6),
      user: {
        name: localStorage.getItem("user_display_name")
      },
      isAudioMuted: false,
      isVideoMuted: false
    }
  }

  startMeet = () => {
    const options = {
      roomName: this.state.room,
      width: '100%',
      height: 500,
      configOverwrite: { prejoinPageEnabled: true},
      interfaceConfigOverwrite: {
        // overwrite interface properties
      },
      parentNode: document.querySelector('#jitsi-iframe'),
      userInfo: {
        displayName: this.state.user.name
      }
    }
    this.api = new window.JitsiMeetExternalAPI(this.domain, options);

    this.api.addEventListeners({
      readyToClose: this.handleClose,
      participantLeft: this.handleParticipantLeft,
      participantJoined: this.handleParticipantJoined,
      videoConferenceJoined: this.handleVideoConferenceJoined,
      videoConferenceLeft: this.handleVideoConferenceLeft,
      audioMuteStatusChanged: this.handleMuteStatus,
      videoMuteStatusChanged: this.handleVideoStatus
    });
  }

    handleClose = () => {
        document.location.href = `/dashboard/advisory_session_meeting/feedback/${this.state.room}`
    }

  handleParticipantLeft = async (participant) => {
  }

  handleParticipantJoined = async () => {
  }

  handleVideoConferenceJoined = async () => {
    ReactGA.event({
      value: 1,
      category: `Advisory Session:${this.state.room}`,
      action: `Participant Joined `
    })
  }

  handleVideoConferenceLeft = async () => {
    ReactGA.event({
      value: 1,
      category: `Advisory Session:${this.state.room}`,
      action: `Participant Left`
    })
    setTimeout(() => {
      window.location.href=`/dashboard/advisory_session_meeting/feedback/${this.state.room}`
    },[500])
  }

  handleMuteStatus = (audio) => {
    ReactGA.event({
      value: audio,
      category: `Advisory Session:${this.state.room}`,
      action: `Clicked Mute/Unmute audio: ${audio.muted}`
    })
  }

  handleVideoStatus = (video) => {
    ReactGA.event({
      value: video,
      category: `Advisory Session Video Status: ${this.state.room}`,
      action: `Clicked Stop/Start camera: ${video.muted}`
    })
  }

  getParticipants() {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve(this.api.getParticipantsInfo()); // get all participants
      }, 60000)
    });
  }


  // custom events
  executeCommand(command) {
    this.api.executeCommand(command);;
    if(command == 'hangup') {
      return this.props.history.push('/thank-you');
    }

    if(command == 'toggleAudio') {
      this.setState({ isAudioMuted: !this.state.isAudioMuted });
    }

    if(command == 'toggleVideo') {
      this.setState({ isVideoMuted: !this.state.isVideoMuted });
    }
  }

  componentDidMount() {
    if (window.JitsiMeetExternalAPI) {
      this.startMeet();
    } else {
      alert('JitsiMeetExternalAPI not loaded');
    }
  }

  render() {
    const { isAudioMuted, isVideoMuted } = this.state;
    return (
      <>
        <div id="jitsi-iframe"></div>
      </>
    );
  }
}

export default JitsiComponent;
