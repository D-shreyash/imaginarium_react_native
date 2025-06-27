// import React, { useState } from "react";
// import {
//   View,
//   TextInput,
//   Button,
//   StyleSheet,
//   Platform,
//   Text,
// } from "react-native";
// import { WebView } from "react-native-webview";

// const Maths = () => {
//   const [expression, setExpression] = useState("x^2 + y^2");
//   const [graphType, setGraphType] = useState("2D");
//   const [graphHTML, setGraphHTML] = useState("");

//   const generateGraphHTML = (newGraphType = graphType) => {
//     const html = `
//       <html>
//         <head>
//           <script src="https://cdn.plot.ly/plotly-latest.min.js"></script>
//           <script src="https://cdnjs.cloudflare.com/ajax/libs/mathjs/10.0.0/math.min.js"></script>
//         </head>
//         <body>
//           <div id="graph" style="width: 100%; height: 100vh;"></div>
//           <script>
//             function plotGraph() {
//               let x = [], y = [], z = [];
//               try {
//                 let expr = '${expression}'.replace(/([0-9])([a-zA-Z])/g, '$1*$2');

//                 if ('${newGraphType}' === '3D') {
//                   for (let i = -10; i <= 10; i += 0.5) {
//                     for (let j = -10; j <= 10; j += 0.5) {
//                       let value = math.evaluate(expr, { x: i, y: j, z: 0 });
//                       x.push(i);
//                       y.push(j);
//                       z.push(value);
//                     }
//                   }
//                   let trace = { x, y, z, mode: 'markers', type: 'scatter3d' };
//                   Plotly.newPlot('graph', [trace]);
//                 } else {
//                   for (let i = -10; i <= 10; i += 0.1) {
//                     let value = math.evaluate(expr, { x: i, y: 0, z: 0 });
//                     x.push(i);
//                     y.push(value);
//                   }
//                   let trace = { x, y, mode: 'lines', type: 'scatter' };
//                   Plotly.newPlot('graph', [trace]);
//                 }
//               } catch (error) {
//                 document.getElementById('graph').innerHTML = "<h3 style='color: red;'>Invalid Expression</h3>";
//               }
//             }
//             plotGraph();
//           </script>
//         </body>
//       </html>`;
//     setGraphHTML(html);
//   };

//   return (
//     <View style={styles.container}>
//       <TextInput
//         style={styles.input}
//         placeholder="Enter function (e.g., x*y + z)"
//         value={expression}
//         onChangeText={setExpression}
//       />
//       <Button title="Generate Graph" onPress={() => generateGraphHTML()} />
//       <View style={styles.buttonContainer}>
//         <Button
//           title="Switch to 2D"
//           onPress={() => {
//             setGraphType("2D");
//             generateGraphHTML("2D");
//           }}
//         />
//         <Button
//           title="Switch to 3D"
//           onPress={() => {
//             setGraphType("3D");
//             generateGraphHTML("3D");
//           }}
//         />
//       </View>

//       {graphHTML && Platform.OS !== "web" ? (
//         <WebView
//           originWhitelist={["*"]}
//           source={{ html: graphHTML }}
//           style={styles.webView}
//         />
//       ) : (
//         Platform.OS === "web" &&
//         graphHTML && (
//           <iframe
//             srcDoc={graphHTML}
//             style={{ width: "100%", height: "100vh", border: "none" }}
//             title="Graph"
//           />
//         )
//       )}
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: "#ecf0f1",
//     padding: 16,
//     justifyContent: "center",
//   },
//   input: {
//     backgroundColor: "#bdc3c7",
//     padding: 12,
//     borderRadius: 8,
//     marginVertical: 10,
//     color: "#2c3e50",
//     borderWidth: 1,
//     borderColor: "#7f8c8d",
//   },
//   buttonContainer: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     marginVertical: 10,
//   },
//   webView: { flex: 1, backgroundColor: "#ffffff", borderRadius: 10 },
// });

// export default Maths;

import React, { useState } from "react";
import {
  View,
  TextInput,
  Button,
  StyleSheet,
  Platform,
  Text,
  ScrollView,
} from "react-native";
import { WebView } from "react-native-webview";

const Maths = () => {
  const [expression, setExpression] = useState("x^2 + y^2");
  const [graphType, setGraphType] = useState("2D");
  const [graphHTML, setGraphHTML] = useState("");
  const [xRange, setXRange] = useState({ min: -10, max: 10 });
  const [yRange, setYRange] = useState({ min: -10, max: 10 });
  const [resolution, setResolution] = useState(0.1); // Reduced default resolution for smoother graphs

  // Enhanced expression preprocessing
  const preprocessExpression = (expr) => {
    let processed = expr;

    // Handle implicit multiplication (2x -> 2*x, 3sin(x) -> 3*sin(x))
    processed = processed.replace(/(\d)([a-zA-Z])/g, "$1*$2");
    processed = processed.replace(/(\))([a-zA-Z\d\(])/g, "$1*$2");
    processed = processed.replace(/([a-zA-Z])(\d)/g, "$1*$2");
    processed = processed.replace(/([a-zA-Z])(\()/g, "$1*$2");

    // Handle common mathematical notation
    processed = processed.replace(/\^/g, "^"); // Power notation
    processed = processed.replace(/ln/g, "log"); // Natural log
    processed = processed.replace(/lg/g, "log10"); // Base 10 log

    // Handle pi and e constants
    processed = processed.replace(/\bpi\b/gi, "pi");
    processed = processed.replace(/\be\b/gi, "e");

    // Handle absolute values |x| -> abs(x)
    processed = processed.replace(/\|([^|]+)\|/g, "abs($1)");

    return processed;
  };

  const generateGraphHTML = (newGraphType = graphType) => {
    const processedExpression = preprocessExpression(expression);

    const html = `
      <html>
        <head>
          <script src="https://cdn.plot.ly/plotly-latest.min.js"></script>
          <script src="https://cdnjs.cloudflare.com/ajax/libs/mathjs/11.11.0/math.min.js"></script>
          <style>
            body { 
              margin: 0; 
              padding: 10px; 
              font-family: Arial, sans-serif; 
              background: #f8f9fa;
            }
            #graph { 
              background: white; 
              border-radius: 8px; 
              box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            }
            .error { 
              color: #e74c3c; 
              text-align: center; 
              padding: 20px;
              background: white;
              border-radius: 8px;
              margin: 10px;
            }
            .info {
              background: #3498db;
              color: white;
              padding: 10px;
              border-radius: 4px;
              margin-bottom: 10px;
              font-size: 14px;
            }
          </style>
        </head>
        <body>
          <div class="info">
            Expression: ${expression} | Type: ${newGraphType} | Range: x[${xRange.min}, ${xRange.max}], y[${yRange.min}, ${yRange.max}] | Resolution: ${resolution}
          </div>
          <div id="graph" style="width: 100%; height: 85vh;"></div>
          <script>
            // Configure math.js for better expression handling
            const mathConfig = {
              number: 'BigNumber',
              precision: 64
            };
            
            function safeEvaluate(expr, scope) {
              try {
                const result = math.evaluate(expr, scope);
                // Handle complex numbers, infinity, and NaN
                if (typeof result === 'object' && result.re !== undefined) {
                  // Handle complex numbers from math.js
                  return isFinite(result.re) ? result.re : null;
                }
                if (typeof result === 'number' && isFinite(result)) {
                  return result;
                }
                return null;
              } catch (error) {
                console.log('Evaluation error:', error.message, 'for scope:', scope);
                return null;
              }
            }
            
            function plotGraph() {
              const expr = '${processedExpression}';
              const xMin = ${xRange.min};
              const xMax = ${xRange.max};
              const yMin = ${yRange.min};
              const yMax = ${yRange.max};
              let step = ${resolution};
              
              // Adaptive step size calculation for better point density
              const xRange = xMax - xMin;
              const yRange = yMax - yMin;
              
              // Ensure minimum point density
              const minPoints2D = 500;  // Minimum points for 2D plots
              const minPoints3D = 50;   // Points per axis for 3D plots
              
              console.log('Plotting expression:', expr);
              console.log('Ranges - X:', xMin, 'to', xMax, ', Y:', yMin, 'to', yMax);
              console.log('Initial step size:', step);
              
              let data = [];
              let hasValidData = false;
              let validCount = 0;
              let totalAttempts = 0;
              
              try {
                if ('${newGraphType}' === '3D') {
                  // Adaptive step size for 3D - ensure good point density
                  const adaptiveStep = Math.max(step, Math.min(xRange / minPoints3D, yRange / minPoints3D));
                  step = adaptiveStep;
                  console.log('Adaptive 3D step size:', step);
                  
                  let x = [], y = [], z = [];
                  
                  for (let i = xMin; i <= xMax; i += step) {
                    for (let j = yMin; j <= yMax; j += step) {
                      totalAttempts++;
                      const value = safeEvaluate(expr, { 
                        x: i, 
                        y: j, 
                        z: 0,
                        a: i, b: j, c: 0, d: 0, // additional variables
                        t: i, u: j, v: 0, w: 0,
                        pi: Math.PI,
                        e: Math.E
                      });
                      
                      if (value !== null && isFinite(value)) {
                        x.push(i);
                        y.push(j);
                        z.push(value);
                        hasValidData = true;
                        validCount++;
                      }
                    }
                  }
                  
                  console.log('3D: Valid points:', validCount, 'out of', totalAttempts);
                  
                  if (hasValidData) {
                    // Create 3D surface plot with better visualization
                    const trace = {
                      x: x,
                      y: y,
                      z: z,
                      type: 'scatter3d',
                      mode: 'markers',
                      marker: {
                        size: 3,
                        color: z,
                        colorscale: 'Viridis',
                        opacity: 0.8,
                        colorbar: {
                          title: 'Z Value'
                        }
                      }
                    };
                    
                    const layout = {
                      title: 'f(x,y) = ' + '${expression}',
                      scene: {
                        xaxis: { 
                          title: 'X',
                          gridcolor: '#ddd',
                          showgrid: true
                        },
                        yaxis: { 
                          title: 'Y',
                          gridcolor: '#ddd',
                          showgrid: true
                        },
                        zaxis: { 
                          title: 'Z',
                          gridcolor: '#ddd',
                          showgrid: true
                        }
                      },
                      margin: { l: 0, r: 0, b: 0, t: 40 }
                    };
                    
                    data = [trace];
                    Plotly.newPlot('graph', data, layout);
                  }
                } else {
                  // 2D plotting with improved resolution
                  let x = [], y = [];
                  
                  // Check if expression contains 'y' (parametric or implicit)
                  const containsY = expr.includes('y');
                  
                  if (containsY) {
                    // For expressions with y, create a contour plot at z=0
                    let xGrid = [], yGrid = [], zGrid = [];
                    
                    // Adaptive step size for contour plots
                    const adaptiveStepX = Math.max(step, xRange / 100);
                    const adaptiveStepY = Math.max(step, yRange / 100);
                    
                    console.log('Contour adaptive steps - X:', adaptiveStepX, 'Y:', adaptiveStepY);
                    
                    for (let i = xMin; i <= xMax; i += adaptiveStepX) {
                      let row = [];
                      for (let j = yMin; j <= yMax; j += adaptiveStepY) {
                        totalAttempts++;
                        const value = safeEvaluate(expr, { 
                          x: i, 
                          y: j, 
                          z: 0,
                          a: i, b: j, c: 0, d: 0,
                          t: i, u: j, v: 0, w: 0,
                          pi: Math.PI,
                          e: Math.E
                        });
                        
                        if (value !== null && isFinite(value)) {
                          row.push(value);
                          hasValidData = true;
                          validCount++;
                        } else {
                          row.push(0);
                        }
                      }
                      zGrid.push(row);
                      xGrid.push(i);
                    }
                    
                    for (let j = yMin; j <= yMax; j += adaptiveStepY) {
                      yGrid.push(j);
                    }
                    
                    console.log('2D Contour: Valid points:', validCount, 'out of', totalAttempts);
                    
                    if (hasValidData) {
                      const trace = {
                        x: xGrid,
                        y: yGrid,
                        z: zGrid,
                        type: 'contour',
                        colorscale: 'Rainbow',
                        contours: {
                          showlines: true,
                          linecolor: 'black',
                          linewidth: 0.5
                        },
                        colorbar: {
                          title: 'Value'
                        }
                      };
                      
                      const layout = {
                        title: 'f(x,y) = ' + '${expression}',
                        xaxis: { 
                          title: 'X',
                          gridcolor: '#ecf0f1',
                          showgrid: true
                        },
                        yaxis: { 
                          title: 'Y',
                          gridcolor: '#ecf0f1',
                          showgrid: true
                        }
                      };
                      
                      data = [trace];
                      Plotly.newPlot('graph', data, layout);
                    }
                  } else {
                    // Standard 2D function plot with better resolution
                    const targetPoints = Math.max(minPoints2D, Math.round(xRange / step));
                    const adaptiveStep = Math.min(step, xRange / targetPoints);
                    
                    console.log('2D Line adaptive step:', adaptiveStep, 'Target points:', targetPoints);
                    
                    for (let i = xMin; i <= xMax; i += adaptiveStep) {
                      totalAttempts++;
                      const value = safeEvaluate(expr, { 
                        x: i, 
                        y: 0, 
                        z: 0,
                        a: i, b: 0, c: 0, d: 0,
                        t: i, u: 0, v: 0, w: 0,
                        pi: Math.PI,
                        e: Math.E
                      });
                      
                      if (value !== null && isFinite(value)) {
                        x.push(i);
                        y.push(value);
                        hasValidData = true;
                        validCount++;
                      }
                    }
                    
                    console.log('2D Line: Valid points:', validCount, 'out of', totalAttempts);
                    
                    if (hasValidData) {
                      const trace = {
                        x: x,
                        y: y,
                        mode: 'lines',
                        type: 'scatter',
                        line: { 
                          width: 2, 
                          color: '#e74c3c',
                          smoothing: 1.3
                        }
                      };
                      
                      const layout = {
                        title: 'f(x) = ' + '${expression}',
                        xaxis: { 
                          title: 'X', 
                          gridcolor: '#ecf0f1',
                          showgrid: true,
                          zeroline: true,
                          zerolinecolor: '#bdc3c7'
                        },
                        yaxis: { 
                          title: 'Y', 
                          gridcolor: '#ecf0f1',
                          showgrid: true,
                          zeroline: true,
                          zerolinecolor: '#bdc3c7'
                        },
                        plot_bgcolor: '#ffffff',
                        paper_bgcolor: '#ffffff'
                      };
                      
                      data = [trace];
                      Plotly.newPlot('graph', data, layout);
                    }
                  }
                }
                
                if (!hasValidData) {
                  // Test a simple evaluation to give better error message
                  const testValue = safeEvaluate(expr, { x: 0, y: 0, z: 0, a: 0, b: 0, c: 0, d: 0, t: 0, u: 0, v: 0, w: 0, pi: Math.PI, e: Math.E });
                  let errorMsg = "<div class='error'><h3>No valid data points found</h3>";
                  errorMsg += "<p><strong>Expression:</strong> " + expr + "</p>";
                  errorMsg += "<p><strong>Ranges:</strong> X[" + xMin + ", " + xMax + "], Y[" + yMin + ", " + yMax + "]</p>";
                  errorMsg += "<p><strong>Resolution:</strong> " + step + "</p>";
                  errorMsg += "<p><strong>Test at (0,0):</strong> " + (testValue !== null ? testValue : "Failed") + "</p>";
                  errorMsg += "<p><strong>Attempts:</strong> " + totalAttempts + " points tested</p>";
                  errorMsg += "<p><strong>Suggestions:</strong></p>";
                  errorMsg += "<ul>";
                  errorMsg += "<li>Try simpler expressions like: x^2, sin(x), x*y</li>";
                  errorMsg += "<li>Adjust the ranges (try -5 to 5)</li>";
                  errorMsg += "<li>Use larger resolution (try 0.5 or 1.0)</li>";
                  errorMsg += "<li>Check for typos in function names</li>";
                  errorMsg += "</ul></div>";
                  
                  document.getElementById('graph').innerHTML = errorMsg;
                }
                
              } catch (error) {
                console.error('Plotting error:', error);
                document.getElementById('graph').innerHTML = 
                  "<div class='error'><h3>Error plotting expression</h3><p><strong>Error:</strong> " + error.message + "</p><p><strong>Expression:</strong> " + expr + "</p><p><strong>Original:</strong> " + '${expression}' + "</p><p>Supported functions: sin, cos, tan, log, exp, sqrt, abs, floor, ceil, round, asin, acos, atan, sinh, cosh, tanh</p></div>";
              }
            }
            
            // Execute plotting
            plotGraph();
          </script>
        </body>
      </html>`;
    setGraphHTML(html);
  };

  const presetExpressions = [
    "x^2 + y^2",
    "x^2",
    "x^3",
    "x^2 + y",
    "x*y",
    "x^2 - y^2",
    "x^3 + y^3",
    "x^2*y",
    "x + y",
    "x^2 + 2*x + 1",
    "x^3 - 3*x",
    "x^4 - x^2",
  ];

  // Quick resolution presets
  const resolutionPresets = [
    { label: "Ultra Fine", value: 0.05 },
    { label: "Fine", value: 0.1 },
    { label: "Normal", value: 0.2 },
    { label: "Coarse", value: 0.5 },
    { label: "Very Coarse", value: 1.0 },
  ];

  return (
    <ScrollView style={styles.container}>
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Mathematical Expression:</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter function (e.g., sin(x*y) + cos(x^2))"
          value={expression}
          onChangeText={setExpression}
          multiline={true}
        />

        <Text style={styles.label}>Preset Examples:</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.presetContainer}
        >
          {presetExpressions.map((preset, index) => (
            <View key={index} style={styles.presetButton}>
              <Button
                title={preset}
                onPress={() => setExpression(preset)}
                color="#3498db"
              />
            </View>
          ))}
        </ScrollView>

        <View style={styles.rangeContainer}>
          <Text style={styles.label}>X Range:</Text>
          <View style={styles.rangeInputs}>
            <TextInput
              style={styles.rangeInput}
              placeholder="Min"
              value={xRange.min.toString()}
              onChangeText={(text) =>
                setXRange({ ...xRange, min: parseFloat(text) || -10 })
              }
              keyboardType="numeric"
            />
            <TextInput
              style={styles.rangeInput}
              placeholder="Max"
              value={xRange.max.toString()}
              onChangeText={(text) =>
                setXRange({ ...xRange, max: parseFloat(text) || 10 })
              }
              keyboardType="numeric"
            />
          </View>

          <Text style={styles.label}>Y Range:</Text>
          <View style={styles.rangeInputs}>
            <TextInput
              style={styles.rangeInput}
              placeholder="Min"
              value={yRange.min.toString()}
              onChangeText={(text) =>
                setYRange({ ...yRange, min: parseFloat(text) || -10 })
              }
              keyboardType="numeric"
            />
            <TextInput
              style={styles.rangeInput}
              placeholder="Max"
              value={yRange.max.toString()}
              onChangeText={(text) =>
                setYRange({ ...yRange, max: parseFloat(text) || 10 })
              }
              keyboardType="numeric"
            />
          </View>

          <Text style={styles.label}>Resolution: {resolution}</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.resolutionContainer}
          >
            {resolutionPresets.map((preset, index) => (
              <View key={index} style={styles.resolutionButton}>
                <Button
                  title={preset.label}
                  onPress={() => setResolution(preset.value)}
                  color={resolution === preset.value ? "#27ae60" : "#95a5a6"}
                />
              </View>
            ))}
          </ScrollView>

          <TextInput
            style={styles.input}
            placeholder="Custom step size (e.g., 0.05)"
            value={resolution.toString()}
            onChangeText={(text) => setResolution(parseFloat(text) || 0.1)}
            keyboardType="numeric"
          />
        </View>

        <Button
          title="Generate Graph"
          onPress={() => generateGraphHTML()}
          color="#27ae60"
        />

        <View style={styles.buttonContainer}>
          <Button
            title="2D Plot"
            onPress={() => {
              setGraphType("2D");
              generateGraphHTML("2D");
            }}
            color="#e74c3c"
          />
          <Button
            title="3D Plot"
            onPress={() => {
              setGraphType("3D");
              generateGraphHTML("3D");
            }}
            color="#9b59b6"
          />
        </View>
      </View>

      {graphHTML && Platform.OS !== "web" ? (
        <WebView
          originWhitelist={["*"]}
          source={{ html: graphHTML }}
          style={styles.webView}
          javaScriptEnabled={true}
          domStorageEnabled={true}
        />
      ) : (
        Platform.OS === "web" &&
        graphHTML && (
          <iframe
            srcDoc={graphHTML}
            style={{
              width: "100%",
              height: "70vh",
              border: "none",
              borderRadius: "8px",
            }}
            title="Graph"
          />
        )
      )}

      <View style={styles.helpContainer}>
        <Text style={styles.helpTitle}>Supported Functions & Operations:</Text>
        <Text style={styles.helpText}>
          • Basic Operations: +, -, *, /, ^{"\n"}• Functions: sqrt, abs, floor,
          ceil, round{"\n"}• Constants: pi, e{"\n"}• Variables: x, y, z and any
          other letters (a, b, c, etc.){"\n"}• Examples: x^2+y^2, a*b+c,
          x^3-3*x, sqrt(x^2+y^2){"\n"}• Tips: Use smaller resolution (0.05-0.1)
          for smoother curves
        </Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  inputContainer: {
    padding: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#2c3e50",
    marginTop: 10,
    marginBottom: 5,
  },
  input: {
    backgroundColor: "#ffffff",
    padding: 12,
    borderRadius: 8,
    marginVertical: 5,
    color: "#2c3e50",
    borderWidth: 1,
    borderColor: "#bdc3c7",
    fontSize: 16,
  },
  presetContainer: {
    flexDirection: "row",
    marginVertical: 10,
  },
  presetButton: {
    marginRight: 10,
  },
  resolutionContainer: {
    flexDirection: "row",
    marginVertical: 10,
  },
  resolutionButton: {
    marginRight: 10,
  },
  rangeContainer: {
    marginVertical: 10,
  },
  rangeInputs: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  rangeInput: {
    backgroundColor: "#ffffff",
    padding: 10,
    borderRadius: 6,
    color: "#2c3e50",
    borderWidth: 1,
    borderColor: "#bdc3c7",
    width: "48%",
    textAlign: "center",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 15,
  },
  webView: {
    height: 500,
    backgroundColor: "#ffffff",
    borderRadius: 10,
    marginHorizontal: 16,
  },
  helpContainer: {
    padding: 16,
    backgroundColor: "#ecf0f1",
    margin: 16,
    borderRadius: 8,
  },
  helpTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#2c3e50",
    marginBottom: 8,
  },
  helpText: {
    fontSize: 14,
    color: "#34495e",
    lineHeight: 20,
  },
});

export default Maths;
