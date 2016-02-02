Websites = new Mongo.Collection("websites");
Comments = new Mongo.Collection("comments");


if (Meteor.isClient) {

	/////
	// template helpers
	/////
	Router.configure({
		layoutTemplate: 'ApplicationLayout'
	});

	Router.route('/', function(){
		this.render('navbartop', {
			to:"head"
		});
		this.render('listviewbody', {
			to:"body"
		});
	});

	Router.route('/detail/:_id', function(){
		//var item = Websites.findOne({"_id":this.params._id})
		this.render('navbartop', {
			to:"head"
		});
		this.render('detailbody', {
			to:"body",
		//	data:{'id':item}
			data:function(){
				return  Websites.findOne({"_id":this.params._id})
			}
			});
	});

	// helper function that returns all available websites
	Template.website_list.helpers({
		websites:function(){
			return Websites.find({}, {sort:{rating:-1}});
		}
	});


	/////
	// template events
	/////

Template.detailbody.events({
	"click .js-comment-submit":function(event){
		console.log("Comment ready to log in siteace.js")
		Comments.insert({'Com':'Sunny'})
	}
});

Template.detailbody.helpers({
	commentSet:function(){
		return Comments.find({})
	}
});

	Template.website_item.events({
		"click .js-upvote":function(event){
			// example of how you can access the id for the website in the database
			// (this is the data context for the template)
			var website_id = this._id;
			console.log("Up voting website with id "+website_id);
			// put the code in here to add a vote to a website!
				// SD - Get the old rating and update the website - TODO: if the user is logged in?
				var rating_l = Websites.findOne({"_id":website_id}).rating
				var uprate_l = Websites.findOne({"_id":website_id}).upRate
				Websites.update({"_id":website_id},{$set:{"upRate":uprate_l+1}})
				Websites.update({"_id":website_id},{$set:{"rating":rating_l+1}})

			return false;// prevent the button from reloading the page
		},
		"click .js-downvote":function(event){

			// example of how you can access the id for the website in the database
			// (this is the data context for the template)
			var website_id = this._id;
			console.log("Down voting website with id "+website_id);

			// put the code in here to remove a vote from a website!
			var rating_l = Websites.findOne({"_id":website_id}).rating
			var downrate_l = Websites.findOne({"_id":website_id}).downRate
			Websites.update({"_id":website_id},{$set:{"downRate":downrate_l+1}})
			Websites.update({"_id":website_id},{$set:{"rating":rating_l-1}})

			return false;// prevent the button from reloading the page
		}
	})

	Template.website_form.helpers({
		userName:function () {
			var user_l = Meteor.users.findOne({"_id":Meteor.userId()})
			var name=""
			if(user_l.profile){ name = user_l.profile.name}
			else{ name = user_l.username }
			return name
		}
	});

	Template.website_form.events({
		"click .js-toggle-website-form":function(event){
			$("#website_form").toggle('slow');
		},
		"submit .js-save-website-form":function(event){

			// here is an example of how to get the url out of the form:
			var url_l = event.target.url.value;
			console.log("The url they entered is: "+url_l);

			//AUtofetch
			a = Meteor.call("getURL",url_l)


			//  put your website saving code in here!
			var title_l = event.target.title.value;
			var description_l = event.target.description.value;
			Websites.insert({
			title:title_l,
			url:url_l,
			description:description_l,
			createdOn:new Date(),
			upRate:0,
			downRate:0,
			rating:0
			});


			$(".js-save-website-form").trigger('reset')
			$("#website_form").toggle('slow');
			return false;// stop the form submit from reloading the page
		}
	});

	Accounts.ui.config({
	  passwordSignupFields: 'USERNAME_AND_EMAIL'
	});

}


if (Meteor.isServer) {

status = ""
content = ""

Meteor.methods(
	{
		getURL: function(url_l){
				console.log("Request: "+url_l)
			//	var httpResult = HTTP.get(url_l){}
			//	 return httpResult.data.response;
			var response = HTTP.get(url_l)
			status = response.statusCode
			content = response.content
			console.log(status)
			console.log(content)
			return content
			 }
	});

	Meteor.publish('response',function(){
			return content
	})

	// start up function that creates entries in the Websites databases.
  Meteor.startup(function () {
    // code to run on server at startup
    if (!Websites.findOne()){
    	console.log("No websites yet. Creating starter data.");
    	  Websites.insert({
    		title:"Goldsmiths Computing Department",
    		url:"http://www.gold.ac.uk/computing/",
    		description:"This is where this course was developed.",
    		createdOn:new Date(),
				upRate:0,
				downRate:0,
				rating:0
    	});
    	 Websites.insert({
    		title:"University of London",
    		url:"http://www.londoninternational.ac.uk/courses/undergraduate/goldsmiths/bsc-creative-computing-bsc-diploma-work-entry-route",
    		description:"University of London International Programme.",
    		createdOn:new Date(),
				upRate:0,
				downRate:0,
				rating:0
    	});
    	 Websites.insert({
    		title:"Coursera",
    		url:"http://www.coursera.org",
    		description:"Universal access to the world’s best education.",
    		createdOn:new Date(),
				upRate:0,
				downRate:0,
				rating:0
    	});
    	Websites.insert({
    		title:"Google",
    		url:"http://www.google.com",
    		description:"Popular search engine.",
    		createdOn:new Date(),
				upRate:0,
				downRate:0,
				rating:0
    	});
    }
  });



}
