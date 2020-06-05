const args = process.argv;
const fs = require('fs')

if(!process.argv[2]){
  console.log("Error:first arguement missing")
  return
}

var argOffset = (process.argv[2] === "test")?1:0
var is_run_for_test = (process.argv[2] === "test")?true:false

if(!process.argv[argOffset+2]){
  console.log("Error:input file arguement missing")
  return
}
if(!process.argv[argOffset+3]){
  console.log("Error:output file arguement missing")
  return
}

const input_file = process.argv[argOffset+2];
const output_file = process.argv[argOffset+3];


fs.readFile(input_file, 'utf8', (err, jsonString) => {
  if (err) {
    console.log("Input file read failed:", err)
    return
  }

  var sample_input = JSON.parse(jsonString)
  var data = sample_input.data

  //If any properties are missing from a bond object, do not include it in your calculations or output.
  data = data.filter(obj => obj.id && obj.type && obj.tenor && obj.yield && obj.amount_outstanding)

  data.map(obj => {obj.tenor = parseFloat(obj.tenor); obj.yield = parseFloat(obj.yield);})

  var corp_data = data.filter(obj => obj.type == "corporate")
  var gov_data = data.filter(obj => obj.type == "government")


  var results = [];
  //find the government bond corresponding to each corporate bond
  corp_data.map(c_bond => {

        gov_data.map(bond => bond.ten_diff = Math.abs(bond.tenor - c_bond.tenor))
        gov_data.sort((a,b) => (a.ten_diff > b.ten_diff)?1:-1)

        var min_tenor_diff = gov_data[0].ten_diff
        var tie_bonds =  gov_data.filter(obj => obj.ten_diff == min_tenor_diff)

        // break tie if 2 bonds have same tenor
        var closest_gov_bond = tie_bonds.sort((a,b) => (a.amount_outstanding < b.amount_outstanding)?1:-1)[0]

        var spread = Math.round(100 * Math.abs(closest_gov_bond.yield - c_bond.yield))

        results.push({
          "corporate_bond_id": c_bond.id,
          "government_bond_id": closest_gov_bond.id,
          "spread_to_benchmark": spread + " bps"
        })
  });

  var output = { "data" : results }

  //if not run for test cases, write to a file
  if(!is_run_for_test) {
      fs.writeFile(output_file, JSON.stringify(output, null, "\t"), err => {
          if(err) {
            console.log('Error writing file', err)
          } else {
            console.log('Successfully wrote output file')
          }
      })
  } else {
    //Read output file and compare it with calculated output
    fs.readFile(output_file, 'utf8', (err, jsonString) => {
      if(err) {
        console.log("Sample test output file read failed:", err)
        return
      }
      var sample_test_output = JSON.parse(jsonString)
      if(JSON.stringify(output) == JSON.stringify(sample_test_output))
       console.log("Test pass. Calculated output matches with provided sample test output.")
      else{
        console.log("Test fail. Calculated output does not match with provided sample test output.")
      }
    })
  }
})