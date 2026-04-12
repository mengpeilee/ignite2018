// MockAPI used to replace Parse backend calls during development
// Returns mock responses matching expected Parse REST shapes
const MockAPI = {
  fetchParse: (url, options = {}) => {
    // simple routing based on URL
    return new Promise((resolve) => {
      if (url.includes("/classes/Career")) {
        resolve({
          results: [{ objectId: "career_mock_1", name: "戰士", used: false }],
        });
        return;
      }
      if (url.includes("/classes/Submission")) {
        resolve({ results: [{ objectId: "submission_mock_1" }] });
        return;
      }
      if (url.includes("/classes/Reset")) {
        resolve({ results: [{ objectId: "reset_mock_1" }] });
        return;
      }
      if (url.includes("/classes/Point")) {
        resolve({
          results: [
            {
              batch: "國高",
              stage: "關卡A",
              to_team: { name: "小隊1" },
              kinds: "strength",
              value: 10,
            },
          ],
        });
        return;
      }
      if (url.includes("/classes/Team")) {
        // GET team list or single team
        if (!options.method || options.method === "GET") {
          resolve({
            results: [
              {
                objectId: "team_mock_1",
                name: "隊伍一",
                career: { name: "戰士" },
                team_total_score: 100,
                strength: 10,
                wisdom: 5,
                vitality: 5,
                faith: 5,
                agility: 5,
                free_point: 10,
                passion: 0,
                creativity: 0,
                intelligence: 0,
                love: 0,
                patience: 0,
              },
            ],
          });
          return;
        }
        // PUT/POST respond success
        resolve({ success: true });
        return;
      }
      // default empty
      resolve({ results: [] });
    });
  },
};

export default MockAPI;
