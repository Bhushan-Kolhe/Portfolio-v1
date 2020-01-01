$(document).ready(() =>{
    var nav = $('#Nav');
    var mainNav = $('#MainNav');
    var hero = $('#Hero');
    var skills = $('#Skills');
    var projects = $('#Projects');
    var misc = $('#Misc');
    var contactMe = $('#ContactMe');
    var navAboutMe = $('#NavAboutMe');
    var navSkills = $('#NavSkills');
    var navProjects = $('#NavProjects');
    var navMisc = $('#NavMisc');
    var navContactMe = $('#NavContactMe');
    var heroHeight = hero.height();
    var skillsHeight = skills.height();
    var projectsHeight = projects.height();
    var miscHeight = misc.height();
    var contactMeHeight = contactMe.height();
    var navBarToggle = $(".NavBarToggle span");

    //Skills Var
    var skillCardContainer = $('.SkillCardContainer');
    var skillText = "";
    var Skills = [
        {
            Title: "Algorithms",
            Level: "Intermediate",
            Percent: "70%",
            id: "progress-algo"
        },
        ,
        {
            Title: "DS",
            Level: "Intermediate",
            Percent: "75%",
            id: "progress-ds"
        },
        ,
        {
            Title: "ML",
            Level: "Intermediate",
            Percent: "55%",
            id: "progress-ml"
        },
        {
            Title: "Python",
            Level: "Intermediate",
            Percent: "80%",
            id: "progress-python"
        },
        {
            Title: "C",
            Level: "Intermediate",
            Percent: "75%",
            id: "progress-c"
        },
        {
            Title: "JavaScript",
            Level: "Intermediate",
            Percent: "80%",
            id: "progress-js"
        },
        {
            Title: "Java",
            Level: "Intermediate",
            Percent: "65%",
            id: "progress-java"
        },
        {
            Title: "C#",
            Level: "Intermediate",
            Percent: "75%",
            id: "progress-csharp"
        },
        {
            Title: "C++",
            Level: "Beginner",
            Percent: "30%",
            id: "progress-cplusplus"
        },
        {
            Title: "Kivy",
            Level: "Intermediate",
            Percent: "70%",
            id: "progress-kivy"
        },
        {
            Title: "Tkinter",
            Level: "Intermediate",
            Percent: "60%",
            id: "progress-tkinter"
        },
        {
            Title: "HTML",
            Level: "Master",
            Percent: "100%",
            id: "progress-html"
        },
        {
            Title: "CSS",
            Level: "Master",
            Percent: "100%",
            id: "progress-css"
        },
        {
            Title: "PHP",
            Level: "Intermediate",
            Percent: "80%",
            id: "progress-php"
        },
        {
            Title: "Node.js",
            Level: "Intermediate",
            Percent: "70%",
            id: "progress-node"
        },
        {
            Title: "Bootstrap",
            Level: "Master",
            Percent: "100%",
            id: "progress-bs"
        },{
            Title: "jQuery",
            Level: "Intermediate",
            Percent: "90%",
            id: "progress-jquery"
        },{
            Title: "XML",
            Level: "Intermediate",
            Percent: "60%",
            id: "progress-xml"
        },{
            Title: "JSON",
            Level: "Intermediate",
            Percent: "85%",
            id: "progress-json"
        },{
            Title: "AJAX",
            Level: "Intermediate",
            Percent: "75%",
            id: "progress-ajax"
        },{
            Title: "MySQL",
            Level: "Intermediate",
            Percent: "85%",
            id: "progress-sql"
        },{
            Title: "MongoDB",
            Level: "Intermediate",
            Percent: "75%",
            id: "progress-mdb"
        },{
            Title: "GitHub",
            Level: "Intermediate",
            Percent: "75%",
            id: "progress-git"
        },{
            Title: "SEO",
            Level: "Intermediate",
            Percent: "80%",
            id: "progress-seo"
        },{
            Title: "Maya",
            Level: "Beginner",
            Percent: "25%",
            id: "progress-maya"
        },{
            Title: "Blender",
            Level: "Beginner",
            Percent: "45%",
            id: "progress-blender"
        },{
            Title: "Unity 3D",
            Level: "Intermediate",
            Percent: "80%",
            id: "progress-unity"
        },{
            Title: "Photoshop",
            Level: "Intermediate",
            Percent: "85%",
            id: "progress-photoshop"
        }
    ];

    //Display Skills
    Skills.forEach(skill => {
        skillText += `<div class="SkillCard">
        <Section class="SkillCardHeader">
            <h3 class="SkillCardTitle">
                `+ skill.Title +`
            </h3>
        </Section>
        <Section class="SkillCardBody">
            <div class="SkillInfo">
                <span class="SkillLevel">`+ skill.Level +`</span>
                <span class="SkillPercentMastered">`+ skill.Percent +`</span>
            </div>
            <div class="bar-container">
                <span class="progressbar progressblue" id="`+ skill.id +`"></span>
            </div>
        </Section>
    </div>`
    });

    skillCardContainer.html(skillText);    





    $(window).scroll(() => {
        var scroll = $(window).scrollTop();
        //NavBar Scroll Background color change
        if (scroll >= 100) {
            nav.addClass('black');
            mainNav.addClass('onScroll');
        } else {
            nav.removeClass("black");
            mainNav.removeClass('onScroll');
        }
        //Navbar link color change
        if(scroll > heroHeight / 2 && scroll < heroHeight + skillsHeight/2){
            navSkills.addClass('navColorChange');
            if(navAboutMe.hasClass('navColorChange')) navAboutMe.removeClass('navColorChange');
            if(navProjects.hasClass('navColorChange')) navProjects.removeClass('navColorChange');
        }else if(scroll > heroHeight + skillsHeight/2 && scroll < heroHeight + skillsHeight + projectsHeight/2){
            navProjects.addClass('navColorChange');
            if(navSkills.hasClass('navColorChange')) navSkills.removeClass('navColorChange');
            if(navMisc.hasClass('navColorChange')) navMisc.removeClass('navColorChange');
        }else if(scroll > heroHeight + skillsHeight + projectsHeight/2  && scroll < heroHeight + skillsHeight + projectsHeight + miscHeight/2){
            navMisc.addClass('navColorChange');
            if(navProjects.hasClass('navColorChange')) navProjects.removeClass('navColorChange');
            if(navContactMe.hasClass('navColorChange')) navContactMe.removeClass('navColorChange');
        }else if(scroll > heroHeight + skillsHeight + projectsHeight + miscHeight/2){
            navContactMe.addClass('navColorChange');
            if(navMisc.hasClass('navColorChange')) navMisc.removeClass('navColorChange');
        }else{
            navAboutMe.addClass('navColorChange');
            if(navSkills.hasClass('navColorChange')) navSkills.removeClass('navColorChange');
        }
    });
    //Colaspable Navbar
    navBarToggle.on("click", () =>{
        if(nav.hasClass('black')) {
            nav.removeClass('black');
            $('#NavRight').css('display','none');
        }
        else {
            nav.addClass('black');
            $('#NavRight').css('display','initial');
        } 
        
    });


    // Get DOM Elements
    const modal = $('#my-modal');
    const modalBtn = $('#SnapchatBtn');
    const modalBtn2 = $('#SnapchatBtn2');
    const closeBtn = $('.close');

    modalBtn.on('click', ()=>{
        modal.css('display','block');
    });

    modalBtn2.on('click', (e)=>{
        e.preventDefault();
        modal.css('display','block');
    });

    closeBtn.on('click', ()=>{
        modal.css('display','none');
    });

    modal.on('click', (e)=>{
        modal.css('display','none');
    });

    // Events
    modalBtn.addEventListener('click', openModal);
    closeBtn.addEventListener('click', closeModal);
    window.addEventListener('click', outsideClick);

    // Open
    function openModal() {
        modal.style.display = 'block';
    }

    // Close
    function closeModal() {
        modal.style.display = 'none';
    }

    // Close If Outside Click
    function outsideClick(e) {
        if (e.target == modal) {
            modal.style.display = 'none';
        }
    }
});
