import {
  FaShieldAlt,
  FaExclamationTriangle,
  FaArrowRight,
} from "react-icons/fa";

import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

import "../css/RiskAssessment.css";


function RiskAssessment() {


  const navigate = useNavigate();


  const [loading,setLoading] = useState(true);

  const [risk,setRisk] = useState({});




  useEffect(()=>{

    loadRiskAssessment();

  },[]);






  const loadRiskAssessment = async()=>{


    try{


      const token =
      localStorage.getItem("access_token") ||
      sessionStorage.getItem("access_token");




      const userResponse = await axios.get(

        "http://127.0.0.1:8000/auth/me",

        {
          headers:{
            Authorization:`Bearer ${token}`,
          }
        }

      );



      const user = userResponse.data;



      const prediction =
      JSON.parse(
        localStorage.getItem("prediction")
      ) || {};




      const analysisData =
      JSON.parse(
        localStorage.getItem("analysisData")
      ) ||
      {
        history:{},
        lifestyle:{}
      };





      const history=[];



      if(analysisData.history?.diabetes)
        history.push("diabetes");


      if(analysisData.history?.hypertension)
        history.push("hypertension");


      if(analysisData.history?.heartDisease)
        history.push("heart disease");


      if(analysisData.history?.asthma)
        history.push("asthma");





      const lifestyle={

        smoking:
        analysisData.lifestyle?.smoking || false,


        alcohol:
        analysisData.lifestyle?.alcohol || false,


        exercise:
        analysisData.lifestyle?.exercise || "",


        sleep:
        analysisData.lifestyle?.sleep || "",


        recent_travel:
        analysisData.lifestyle?.recent_travel || false,


        high_risk_job:
        analysisData.lifestyle?.high_risk_job || false,

      };





      const response = await axios.post(

        "http://127.0.0.1:8000/risk/assess",

        {

          prediction_id:
          prediction.prediction_id,


          disease:
          prediction["Predicted Disease"],


          symptoms:
          prediction["Selected Symptoms"],


          age:user.age,


          history,


          lifestyle

        }

      );




      localStorage.setItem(

        "riskAssessment",

        JSON.stringify(response.data)

      );



      setRisk(response.data);

      setLoading(false);



    }
    catch(error){

      console.error(error);

      alert(
        "Unable to calculate Risk Assessment"
      );

      setLoading(false);

    }


  };







  if(loading){


    return(

      <div className="loading-page">

        <h2>
          Calculating AI Health Risk...
        </h2>

      </div>

    );

  }








  const {

    "Disease Score":diseaseScore=0,

    "Symptom Score":symptomScore=0,

    "Age Score":ageScore=0,

    "Medical History Score":historyScore=0,

    "Lifestyle Score":lifestyleScore=0,

    "Total Risk Score":totalRiskScore=0,

    "Risk Level":riskLevel="LOW"


  }=risk;









  const getRiskColor=()=>{


    switch(riskLevel){


      case "LOW":
        return "#22c55e";


      case "MEDIUM":
        return "#f59e0b";


      case "HIGH":
        return "#f97316";


      case "CRITICAL":
        return "#ef4444";


      default:
        return "#2563eb";

    }

  };







  const getRecommendation=()=>{


    if(riskLevel==="LOW")

      return "Your health risk is low. Continue maintaining a healthy lifestyle.";


    if(riskLevel==="MEDIUM")

      return "Moderate risk detected. Monitor symptoms and maintain regular health checkups.";


    if(riskLevel==="HIGH")

      return "High risk detected. Please consult a healthcare professional.";


    return "Critical risk detected. Immediate medical attention is recommended.";

  };









  return(


<div className="risk-page">





{/* ================= HERO ================= */}


<div className="hero-card">


<div className="hero-left">


<h1>
AI Health Risk Assessment
</h1>


<p>

Our AI system analyzed your symptoms,
medical history and lifestyle factors to
calculate your current health risk level.

</p>


</div>





<div>


<div

className="risk-circle"

style={{

border:`8px solid ${getRiskColor()}`

}}

>


<h2>
{totalRiskScore}
</h2>


<span>
/100
</span>


<p className="risk-level">

{riskLevel} RISK

</p>


</div>


</div>



</div>










{/* ================= SUMMARY ================= */}



<div className="summary-grid">



<div className="score-card">

<h5>
Disease Impact
</h5>

<h3>
{diseaseScore}
</h3>

</div>




<div className="score-card">

<h5>
Symptom Severity
</h5>

<h3>
{symptomScore}
</h3>

</div>





<div className="score-card">

<h5>
Age Factor
</h5>

<h3>
{ageScore}
</h3>

</div>





<div className="score-card">

<h5>
Lifestyle
</h5>

<h3>
{lifestyleScore}
</h3>

</div>



</div>









{/* ================= BREAKDOWN ================= */}



<div className="breakdown-card">


<h3>
Risk Factor Breakdown
</h3>





{

[

{
name:"Disease Severity",
value:diseaseScore,
max:30
},

{
name:"Symptoms",
value:symptomScore,
max:25
},

{
name:"Age Factor",
value:ageScore,
max:15
},

{
name:"Medical History",
value:historyScore,
max:15
},

{
name:"Lifestyle",
value:lifestyleScore,
max:15
}

].map((item,index)=>(


<div
className="breakdown-item"
key={index}
>


<div className="breakdown-top">


<span>
{item.name}
</span>


<strong>
{item.value}/{item.max}
</strong>


</div>



<div className="progress-custom">


<div

className="progress-fill"

style={{

width:
`${(item.value/item.max)*100}%`,

background:getRiskColor()

}}

>

</div>


</div>


</div>


))

}



</div>










{/* ================= RECOMMENDATION ================= */}



<div className="recommendation-card">


<FaExclamationTriangle className="rec-icon"/>


<div>


<h4>
AI Recommendation
</h4>


<p>
{getRecommendation()}
</p>


</div>


</div>









{/* ================= DISCLAIMER ================= */}



<div className="disclaimer-card">


<FaShieldAlt className="disclaimer-icon"/>


<div>


<h4>
Medical Disclaimer
</h4>


<p>

This AI-generated risk assessment is only for
informational purposes. Please consult a
qualified healthcare professional for medical decisions.

</p>


</div>


</div>









{/* ================= BUTTON ================= */}



<div className="button-area">


<button

className="next-btn"

onClick={()=>navigate("/recommendation")}

>


Continue To Treatment


<FaArrowRight/>


</button>


</div>
{/* =================================================
    FOOTER
================================================= */}

<div className="dashboard-footer">
  <p>
    © 2026 MedAssist AI | AI-Powered Medical Symptom Analysis & Disease Prediction System
  </p>
</div>






</div>


);


}



export default RiskAssessment;