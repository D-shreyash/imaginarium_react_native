import React, { useState } from "react";
import { View, TextInput, Button, StyleSheet } from "react-native";
import { WebView } from "react-native-webview";

const Maths = () => {
  const [expression, setExpression] = useState("x^2 + y^2");
  const [graphType, setGraphType] = useState("2D");
  const [graphHTML, setGraphHTML] = useState("");

  const generateGraphHTML = (newGraphType = graphType) => {
    const html = `<html>
        <head>
          <script src="https://cdn.plot.ly/plotly-latest.min.js"></script>
          <script src="https://cdnjs.cloudflare.com/ajax/libs/mathjs/10.0.0/math.min.js"></script>
        </head>
        <body>
          <div id="graph" style="width: 100%; height: 100vh;"></div>
          <script>
            function plotGraph() {
              let x = [], y = [], z = [];
              try {
                let expr = '${expression}'.replace(/([0-9])([a-zA-Z])/g, '$1*$2');

                if ('${newGraphType}' === '3D') {
                  for (let i = -10; i <= 10; i += 0.5) {
                    for (let j = -10; j <= 10; j += 0.5) {
                      let value = math.evaluate(expr, { x: i, y: j, z: 0 });
                      x.push(i);
                      y.push(j);
                      z.push(value);
                    }
                  }
                  let trace = { x, y, z, mode: 'markers', type: 'scatter3d' };
                  Plotly.newPlot('graph', [trace]);
                } else {
                  for (let i = -10; i <= 10; i += 0.1) {
                    let value = math.evaluate(expr, { x: i, y: 0, z: 0 });
                    x.push(i);
                    y.push(value);
                  }
                  let trace = { x, y, mode: 'lines', type: 'scatter' };
                  Plotly.newPlot('graph', [trace]);
                }
              } catch (error) {
                document.getElementById('graph').innerHTML = "<h3 style='color: red;'>Invalid Expression</h3>";
              }
            }
            plotGraph();
          </script>
        </body>
      </html>`;
    setGraphHTML(html);
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Enter function (e.g., x*y + z)"
        value={expression}
        onChangeText={setExpression}
      />
      <Button title="Generate Graph" onPress={() => generateGraphHTML()} />
      <View style={styles.buttonContainer}>
        <Button
          title="Switch to 2D"
          onPress={() => {
            setGraphType("2D");
            generateGraphHTML("2D");
          }}
        />
        <Button
          title="Switch to 3D"
          onPress={() => {
            setGraphType("3D");
            generateGraphHTML("3D");
          }}
        />
      </View>
      {graphHTML ? (
        <WebView
          originWhitelist={["*"]}
          source={{ html: graphHTML }}
          style={styles.webView}
        />
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ecf0f1",
    padding: 16,
    justifyContent: "center",
  },
  input: {
    backgroundColor: "#bdc3c7",
    padding: 12,
    borderRadius: 8,
    marginVertical: 10,
    color: "#2c3e50",
    borderWidth: 1,
    borderColor: "#7f8c8d",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 10,
  },
  webView: {
    flex: 1,
    backgroundColor: "#ffffff",
    borderRadius: 10,
  },
});

export default Maths;
