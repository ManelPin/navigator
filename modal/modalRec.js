import React, {Component, useState} from 'react';
import {Modal, Text, TouchableHighlight, View, Alert, StyleSheet, TouchableOpacity} from 'react-native';
import { Button, PermissionsAndroid, Platform, SafeAreaView,  Switch } from 'react-native';
import { Player, Recorder, MediaStates } from '@react-native-community/audio-toolkit';

name='Vitor '

type Props = {};
  
 type State = {
    playPauseButton: string,
    recordButton: string,
  
    stopButtonDisabled: boolean,
    playButtonDisabled: boolean,
    recordButtonDisabled: boolean,
  
    loopButtonStatus: boolean,
    progress: number,
    modalVisible: boolean,
    filename: string,
  
    error: string | null
  };


class Mymodal extends Component<Props, State> {
 
  
  actualPath="hello";

  setModalVisible(visible) {
    this.setState({modalVisible: visible});
  };
  
  constructor(props: Props) {
    super(props);

    this.state = {
      playPauseButton: 'Preparing...',
      recordButton: 'Preparing...',

      stopButtonDisabled: true,
      playButtonDisabled: true,
      recordButtonDisabled: true,

      loopButtonStatus: false,
      progress: 0,
      modalVisible: false,
      filename: 'testeAudio.mp4',

      error: null
    };
  }
  componentWillMount() {
    this.player = null;
    this.recorder = null;
    this.lastSeek = 0;

    this._reloadPlayer();
    this._reloadRecorder();

    this._progressInterval = setInterval(() => {
      if (this.player && this._shouldUpdateProgressBar()) {
        let currentProgress = Math.max(0, this.player.currentTime) / this.player.duration;
        if (isNaN(currentProgress)) {
          currentProgress = 0;
        }
        this.setState({ progress: currentProgress });
      }
    }, 100);
  }

  componentWillUnmount() {
    clearInterval(this._progressInterval);
  }

  _shouldUpdateProgressBar() {
    // Debounce progress bar update by 200 ms
    return Date.now() - this.lastSeek > 200;
  }

  _updateState(err) {
    this.setState({
      playPauseButton: this.player && this.player.isPlaying ? 'Pause' : 'Play',
      recordButton: this.recorder && this.recorder.isRecording ? 'Stop' : 'Record',

      stopButtonDisabled: !this.player || !this.player.canStop,
      playButtonDisabled: !this.player || !this.player.canPlay || this.recorder.isRecording,
      recordButtonDisabled: !this.recorder || (this.player && !this.player.isStopped),
    });
  }
  sendMessage(name){
    
  }

  _playPause() {
    this.player.playPause((err, paused) => {
      if (err) {
        this.setState({
          error: err.message
        });
      }
      this._updateState();
    });
  }

  _stop() {
    this.player.stop(() => {
      this._updateState();
    });
  }

  _seek(percentage) {
    if (!this.player) {
      return;
    }

    this.lastSeek = Date.now();
    console.log(Date.now)
    let position = percentage * this.player.duration;

    this.player.seek(position, () => {
      this._updateState();
    });
  }

  _reloadPlayer() {
    if (this.player) {
      this.player.destroy();
    }

    this.player = new Player(this.state.filename, {
      autoDestroy: false
    }).prepare((err,fsPath) => {
      if (err) {
        console.log('error at _reloadPlayer():');
        console.log(err);
      } else {
        console.log(fsPath);
        console.log(this.state.filename);
        this.actualPath=fsPath;
        this.player.looping = this.state.loopButtonStatus;
        
      }

      this._updateState();
    });

    this._updateState();

    this.player.on('ended', () => {
      this._updateState();
    });
    this.player.on('pause', () => {
      this._updateState();
    });
  }

  _reloadRecorder() {
    if (this.recorder) {
      this.recorder.stop();
      this.recorder.destroy();
    }

    this.recorder = new Recorder(this.state.filename, {
      bitrate: 256000,
      channels: 2,
      sampleRate: 44100,
      quality: 'max'
    }).prepare((err,fsPath) => {
      if (err) {
        console.log('error at _reloadPlayer():');
        console.log(err);
      } else {
        console.log(fsPath);
        console.log(this.state.filename);
        this.actualPath=fsPath;
        this.player.looping = this.state.loopButtonStatus;
        
      }

      this._updateState();
    });

    this._updateState();
  }
  _toggleRecord() {
    if (this.player) {
      this.player.destroy();
    }

    let recordAudioRequest;
    let recordWriteRequest;
    if (Platform.OS == 'android') {
      recordAudioRequest = this._requestRecordAudioPermission();
      recordWriteRequest= this._requestWritePermission();
    } else {
      recordAudioRequest = new Promise(function (resolve, reject) { resolve(true); });
    }

    recordAudioRequest.then((hasPermission) => {
      if (!hasPermission) {
        this.setState({
          error: 'Record Audio Permission was denied'
        });
        return;
      }

      
    });

    recordWriteRequest.then((hasPermission) => {
      if (!hasPermission) {
        this.setState({
          error: 'Write Storage Permission was denied'
        });
        return;
      }

      this.recorder.toggleRecord((err, stopped) => {
        if (err) {
          this.setState({
            error: err.message
          });
        }
        if (stopped) {
          this._reloadPlayer();
          this._reloadRecorder();
        }

        this._updateState();
      });
    });
  }

  async _requestRecordAudioPermission() {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
        {
          title: 'Microphone Permission',
          message: 'App needs access to your microphone to test react-native-audio-toolkit.',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        },
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        return true;
      } else {
        return false;
      }
    } catch (err) {
      console.error(err);
      return false;
    }
  }
  async _requestWritePermission() {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
        {
          title: 'Storage Permission',
          message: 'App needs access to storage Write.',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        },
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        return true;
      } else {
        return false;
      }
    } catch (err) {
      console.error(err);
      return false;
    }
  }

  _toggleLooping(value) {
    this.setState({
      loopButtonStatus: value
    });
    if (this.player) {
      this.player.looping = value;
    }
  }
 

  render() {
    
    return (
      <View style={styles.container}>
        
      transparent={false}
      visible={this.state.modalVisible}
      onRequestClose={() => {
        Alert.alert('Modal has been closed.');
      }}>
      <View style={styles.modal}>
        <View>
        <View style={styles.modalContainer}>
        <View style={styles.modalHeader}>
    <Text style={styles.title}>Record message to {name}</Text>
      <View style={styles.divider}></View>
    </View>
    <View>
          <Text style={styles.title}>
            Playback
          </Text>
        </View>
        <View >
          <Button title={this.state.playPauseButton} disabled={this.state.playButtonDisabled} onPress={() => this._playPause()} />
          <Button title={'Stop'} disabled={this.state.stopButtonDisabled} onPress={() => this._stop()} />
        </View>
        
        
        <View>
          <Text style={styles.title}>
            Recording
          </Text>
        </View>
        <View>
          <Button title={this.state.recordButton} disabled={this.state.recordButtonDisabled} onPress={() => this._toggleRecord()} />
        </View>
        <View>
          <Text style={styles.errorMessage}>{this.state.error}</Text>
        </View>
    <View style={styles.modalBody}>
    <Text style={styles.bodyText}>Send Message To {name} ?</Text>
    </View>
    <View style={styles.modalFooter}>
      <View style={styles.divider}></View>
      <View style={{flexDirection:"row-reverse",margin:10}}>
        <TouchableOpacity style={{...styles.actions,backgroundColor:"#db2828"}} 
          onPress={() => {
            this.setModalVisible(false);
          }}>
          <Text style={styles.actionText}>No</Text>
        </TouchableOpacity>
        <TouchableOpacity style={{...styles.actions,backgroundColor:"#21ba45"}}
          onPress={() => {
            this.recorder.stop();
            this.setModalVisible(false);
          }}>
          <Text style={styles.actionText}>Yes</Text>
        </TouchableOpacity>
      </View>
    </View>
    </View>
        </View>
      </View>
  
      
      

      <TouchableOpacity
        onPress={() => {
          this.setModalVisible(!this.state.modalVisible);
        }}>
        <Text>Record Message to {name}</Text>
      </TouchableOpacity>
    </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
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
export default Mymodal;