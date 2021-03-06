import React, { Component } from 'react';
import {
  ScrollView,
  View,
  Dimensions,
  AsyncStorage
} from 'react-native';
import Parse from 'parse/react-native';
import { connect } from 'react-redux';
import { Table, Row } from 'react-native-table-component';

const { width } = Dimensions.get('window');

class Rank extends Component {

  state = { 
    TeamData: {},
    tableHead: ['排名', '小隊', '職業', '分數'],
    tableData: [],
    widthArr: [width * 0.15, width * 0.21, width * 0.315, width * 0.25],
    reload: this.props.reload
  };

 componentDidMount() {
    this.getTeamScore();
  }

  //讓Rank重loading
  componentWillReceiveProps() {
    console.log('HIHIH');
    this.getTeamScore();
  }
  
  //功能： 1.以Parse SDK取得資料 2.將資料依分數由大到小排列 3.將排序的資料抽出'排名''小隊''職業''分數'放入this.state.tableData中
  async getTeamScore() {
    const Team = Parse.Object.extend('Team');
    const query = new Parse.Query(Team);
    query.include('career');
    //判別要撈出 國高 還是 大專 的team分數
    const batch = await AsyncStorage.getItem('gm_batch');
    if (batch === null) {
      //隊長專屬
      query.equalTo('batch', this.props.batch);
    } else {
      //GM專屬
      query.equalTo('batch', batch);
    }
    query.find()
      .then((response) => {
      //將取得的物件資料複製一份到obj
      const CopyRes = [...response];
      //將此物件依據小隊總分由大到小(b-a)的順序來排序
      CopyRes.sort((a, b) => b.attributes.team_total_score - a.attributes.team_total_score);
      this.setState({ TeamData: CopyRes });
      //選出要的資料放入tableData中
        const finalDataAry = [];
        let rank = 1;
        CopyRes.map((teamdata) => {
          if (rank < 17) {
            finalDataAry.push([rank, teamdata.attributes.name, teamdata.attributes.career.attributes.name, teamdata.attributes.team_total_score]);
            rank++;
          }
          return true;
        });
        this.setState({ tableData: finalDataAry });
      })
      .catch((error) => {
        console.log(error);
      });
  }

  render() {
    const { container } = styles;

    return (
      <View style={container}>
        <Table borderStyle={{ borderWidth: 2, borderColor: '#fff' }}>
          <Row 
            data={this.state.tableHead} 
            widthArr={this.state.widthArr} 
            style={styles.head} 
            textStyle={styles.headText} 
          />
        </Table>
      
        <ScrollView style={styles.dataWrapper}>
          <Table 
            borderStyle={{ borderWidth: 2, borderColor: '#fff' }}
          >
            {
              this.state.tableData.map((rowData, index) => (
                <Row
                  key={index}
                  data={rowData}
                  widthArr={this.state.widthArr}
                  style={[styles.row, index % 2 && { backgroundColor: '#bbc3dc' }]}
                  textStyle={styles.text}
                />
              ))
            }
          </Table>
        </ScrollView>
      </View>
    );
  }
}

const styles = {
  container: {
      flex: 1, 
      padding: 13,
      backgroundColor: '#fff'
  },
  head: { 
    height: 40,
    backgroundColor: '#AAAAAA'
  },
  text: { 
    margin: 6,
    textAlign: 'center', 
    fontWeight: '400' 
  },
  headText: {
    fontSize: 16,
    margin: 6,
    textAlign: 'center', 
    fontWeight: '600',
    color: 'white'
  },
  dataWrapper: { 
    marginTop: -1 
  },
  row: { 
    height: 40, 
    backgroundColor: '#d2e9ff' 
  }
};

const mapStateToProps = ({ player }) => {
  const {  
    batch, //國高or大專
   } = player;

  return { 
    batch, //國高or大專
  };
};

export default connect(mapStateToProps, {})(Rank);
