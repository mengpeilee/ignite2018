import React, { Component } from "react";
import { ScrollView, View, Dimensions } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import MockAPI from "../../mock/MockAPI";
import Setting from "../../Setting.json";
const fetch = (url, options) => MockAPI.fetchParse(url, options);

import { connect } from "react-redux";
import { Table, Row } from "react-native-table-component";

const { width } = Dimensions.get("window");

class Rank extends Component {
  state = {
    TeamData: {},
    tableHead: ["排名", "小隊", "職業", "分數"],
    tableData: [],
    widthArr: [width * 0.15, width * 0.21, width * 0.315, width * 0.25],
    reload: this.props.reload,
  };

  componentDidMount() {
    this.getTeamScore();
  }

  //讓Rank重loading
  componentWillReceiveProps() {
    console.log("HIHIH");
    this.getTeamScore();
  }

  //功能： 1.以Parse SDK取得資料 2.將資料依分數由大到小排列 3.將排序的資料抽出'排名''小隊''職業''分數'放入this.state.tableData中
  async getTeamScore() {
    // Use mock backend to fetch team list and build ranking
    const batch = await AsyncStorage.getItem("gm_batch");
    const queryBatch = batch === null ? this.props.batch : batch;
    const params = { where: { batch: queryBatch }, include: "career" };
    const esc = encodeURIComponent;
    const query = Object.keys(params)
      .map((k) => `${esc(k)}=${esc(JSON.stringify(params[k]))}`)
      .join("&");
    fetch(`${Setting.parseServerURL}/classes/Team?${query}`, { method: "GET" })
      .then((response) => {
        // response.results is an array of team objects
        const CopyRes = response.results.map((r) => ({ attributes: r }));
        // sort by team_total_score
        CopyRes.sort(
          (a, b) =>
            b.attributes.team_total_score - a.attributes.team_total_score,
        );
        this.setState({ TeamData: CopyRes });
        const finalDataAry = [];
        let rank = 1;
        CopyRes.map((teamdata) => {
          if (rank < 17) {
            finalDataAry.push([
              rank,
              teamdata.attributes.name,
              teamdata.attributes.career.name || teamdata.attributes.career,
              teamdata.attributes.team_total_score,
            ]);
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
        <Table borderStyle={{ borderWidth: 2, borderColor: "#fff" }}>
          <Row
            data={this.state.tableHead}
            widthArr={this.state.widthArr}
            style={styles.head}
            textStyle={styles.headText}
          />
        </Table>

        <ScrollView style={styles.dataWrapper}>
          <Table borderStyle={{ borderWidth: 2, borderColor: "#fff" }}>
            {this.state.tableData.map((rowData, index) => (
              <Row
                key={index}
                data={rowData}
                widthArr={this.state.widthArr}
                style={[
                  styles.row,
                  index % 2 && { backgroundColor: "#bbc3dc" },
                ]}
                textStyle={styles.text}
              />
            ))}
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
    backgroundColor: "#fff",
  },
  head: {
    height: 40,
    backgroundColor: "#AAAAAA",
  },
  text: {
    margin: 6,
    textAlign: "center",
    fontWeight: "400",
  },
  headText: {
    fontSize: 16,
    margin: 6,
    textAlign: "center",
    fontWeight: "600",
    color: "white",
  },
  dataWrapper: {
    marginTop: -1,
  },
  row: {
    height: 40,
    backgroundColor: "#d2e9ff",
  },
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
