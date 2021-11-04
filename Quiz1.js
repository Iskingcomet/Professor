const appState = {
    current_view : "#intro_view",
    current_question : -1,
    current_model : {},
    quiz_Name: "",
    current_correct:0,
    current_incorrect:0,
    questions_total:20,
}


async function get_quiz_data(quiz_Name, current_question) {
    var api_url = 'http://my-json-server.typicode.com/iskingcomet/CUS1172_Quiz/'
    var endpoint = `${api_url}/${quiz_Name}/${current_question}`

    const data = await fetch(endpoint)
    var model = await data.json()

    appState.current_model = model;
    console.log(data)
    updateQuestion(appState);
    setQuestionView(appState);
    
    update_view(appState);

    return model
}
  
  
  // appState, keep information about the State of the application.
 
  //
  // start_app: begin the applications.
  //
  
  document.addEventListener('DOMContentLoaded', () => {
    // Set the state
    appState.current_view =  "#intro_view";
    appState.current_model = {
      action : "start_app"
    }
    update_view(appState);
  
  
  
    document.querySelector("#widget_view").onclick = (e) => {
        handle_widget_event(e)
    }
  });
  
  
  
  function handle_widget_event(e) {
  
    if (appState.current_view == "#intro_view"){
      if (e.target.dataset.action == "start_app") {
        appState.current_question = 0
        appState.quiz_Name = document.querySelector('input[name="quiz_Name"]:checked').value;
          var current_question_data = get_quiz_data(appState.quiz_Name, appState.current_question)
         // appState.current_model = current_question_data;
          // process the appState, based on question type update appState.current_view
       //   updateQuestion(appState)
      //    setQuestionView(appState);
         
          // Now that the state is updated, update the view.
          //updateQuestion(appState)
        //  update_view(appState);
          
          console.log(appState)
        //  console.log(appState.current_model)
   //       console.log(appState.current_model.question)
      }
    }
  
    //if (appState.quiz_Name== quiz1)
    // Handle the answer event.
    if (appState.current_view == "#question_view_true_false") {
  
      if (e.target.dataset.action == "answer") {
         // Controller - implement logic.
         isCorrect = check_user_response(e.target.dataset.answer, appState.current_model);
       
         // Update the state.
         appState.current_question =   appState.current_question + 1;
         appState.current_model = questions[appState.current_question];
         setQuestionView(appState);
       
         // Update the view.  
         update_view(appState);
  
       }
     }
  
     // Handle answer event for  text questions.
     if (appState.current_view == "#question_view_text_input") {
         if (e.target.dataset.action == "submit") {
       
             user_response = document.querySelector(`#${appState.current_model.answerFieldId}`).value;
             isCorrect = check_user_response(e.target.dataset.answer, appState.current_model);
             updateQuestion(appState)
             //appState.current_question =   appState.current_question + 1;
             //appState.current_model = questions[appState.current_question];
             setQuestionView(appState);
             update_view(appState);
         }
      }

      if (appState.current_view == "#question_view_multiple_choice") {
        if (e.target.dataset.action == "answer") {
           // Controller - implement logic.
           isCorrect = check_user_response(e.target.dataset.answer, appState.current_model);
       
         // Update the state.
         updateQuestion(appState);
         setQuestionView(appState);
       
         // Update the view.  
         update_view(appState);
         }
       }
       
  
      // Handle answer event for  text questions.
      if (appState.current_view == "#end_view") {
          if (e.target.dataset.action == "start_again") {
            appState.current_view =  "#intro_view";
            appState.current_model = {
              action : "start_app"
            }
            update_view(appState);
  
          }
        }
  
   } // end of hadnle_widget_event
  
  
  function check_user_response(user_answer, model) {
    if (user_answer == model.correctAnswer) {
      return true;
    }
    return false;
  }
  
  function updateQuestion(appState) {
      if (appState.current_question < appState.questions_total.length-1) {
        appState.current_question =  appState.current_question + 1;
     //   let questionData = get_quiz_data(appState.quiz_Name,appState.current_question)
        appState.current_model = questionData
      }
      else {
        appState.current_question = -2;
        appState.current_model = {};
      }
  }
  
  function setQuestionView(appState) {
      console.log(appState.current_model.questionType)
    if (appState.current_question == -2) {
      appState.current_view  = "#end_view";
      return
    }
  console.log(appState.current_model.questionType)
    if (appState.current_model.questionType == "true_false")
      appState.current_view = "#question_view_true_false";
    else if (appState.current_model.questionType == "text_input") {
      appState.current_view = "#question_view_text_input";
    }
    else if(appState.current_model.questionType == "multiple_Choice") {
        appState.current_view = "#question_view_multiple_choice";
        console.log("hello")
      }
  }
  
  function update_view(appState) {
  
    const html_element = render_widget(appState.current_model, appState.current_view)
    document.querySelector("#widget_view").innerHTML = html_element;
  }
  //
  
  const render_widget = (model,view) => {
    // Get the template HTML
    template_source = document.querySelector(view).innerHTML
    // Handlebars compiles the above source into a template
    var template = Handlebars.compile(template_source);
  
    // apply the model to the template.
    var html_widget_element = template({...model,...appState})
  
    return html_widget_element
  }
