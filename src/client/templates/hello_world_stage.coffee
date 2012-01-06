Peanutty.loadEnvironment()
peanutty.runSimulation()

peanutty.sendMessage
    message: 
        """
        <strong>Welcome to Peanutty!</strong>
        <p>
            To get started, type your name in and then destroy it with boxes, balls, or freeform shapes.
        </p>
        """

peanutty.createGround
    x: peanutty.canvas.width() / 2
    y: peanutty.canvas.height() - 50
    width: 600
    height: 10
    
# INPUTS

instructions = $(document.createElement("DIV"))
instructions.addClass('stage_element')
instructions.css
    height: '30px'
    width: '300px'
    textAlign: 'center'
    fontSize: '20pt'
    position: 'absolute'
    top: '20px'
    left: "#{(peanutty.canvas.width() / 2) - 150}px"
instructions.html("Type your name:")
view.$('#canvas_container').append(instructions)

window.nameInput = $(document.createElement('INPUT'))
nameInput.addClass('stage_element')
nameInput.css
    width: '300px'
    height: '30px'
    fontSize: '20pt'
    position: 'absolute'
    top: '50px'
    left: "#{(peanutty.canvas.width() / 2) - 150}px"
    
nameInput.bind 'keyup', (e) ->
    letters = $(e.currentTarget).val().replace(/[^A-Za-z\s]/ig, '')
    view.loadScript()
    peanutty.destroyDynamicObjects()
    peanutty.addToScript
        command:
            """
            peanutty.destroyDynamicObjects()
            nameInput.val("#{letters}") if nameInput.val() != "#{letters}"
            peanutty.createLetters
                x: peanutty.canvas.width() / 2
                y: peanutty.canvas.height() - 55
                letters: "#{letters}"
            """
        time: 0
    window.lastNameInputKey = new Date()    
    $.timeout 1500, () =>
        return if new Date() - window.lastNameInputKey < 1500
        destroyInstructions = $(document.createElement("DIV"))
        destroyInstructions.addClass('stage_element')
        destroyInstructions.css
            height: '30px'
            width: '300px'
            textAlign: 'center'
            fontSize: '12pt'
            position: 'absolute'
            top: '90px'
            left: "#{(peanutty.canvas.width() / 2) - 150}px"
        destroyInstructions.html("Now destroy your name!<br/>(click anywhere below this but above your name)")
        view.$('#canvas_container').append(destroyInstructions)
        peanutty.sendMessage
            message:
                """
                    <h3> 
                        Ready for the next challenge? 
                        <a id='next_challenge'>Load it up ></a>
                    </h3>
                """
        view.$('#next_challenge').bind 'click', => view.loadNewStage('stack_em')
            
view.$('#canvas_container').append(nameInput)
nameInput[0].focus()


codeChangeMessageShown = false
view.$('#codes .code').bind 'keypress', () =>
    return if codeChangeMessageShown
    codeChangeMessageShown = true
    peanutty.sendCodeMessage
        message:
            """
            You've changed your script.
            To see your changes you'll need to rerun your script by clicking "Run Script" above.
            (<a id='close_code_message'>close this</a>)       
            """
    view.$('#close_code_message').bind 'click', () => view.$('#codes .message').removeClass('displayed')


# LETTERS

Peanutty::createLetters = ({x, y, letters}) ->
    width = @getLettersWidth letters: letters
    start = x - (width / 2) - (4 * ((letters.length - 1) / 2))
    for letter in letters
        letterWidth = @getLettersWidth(letters: letter)
        @createLetter(x: start, y: y, letter: letter)
        start += letterWidth + 4
        
Peanutty::getLettersWidth = ({letters}) ->
    totalWidth = 0 
    for letter in letters
        if letter == ' '
            totalWidth += 25
        else
            baseWidth = if letter.toLowerCase() == letter then 50 else 60
            totalWidth += switch letter
                when 'a' then 70
                when 'A' then 78
                when 'd', 'h', 'l', 'o', 'r' then 40
                when 'W' then 80
                else baseWidth
                
    return totalWidth
    
Peanutty::createLetter = ({x, y, letter}) ->
    switch letter
        when "a"
            @createPoly
                fixtureDefs: [
                    @polyFixtureDef(path: [{x: x, y: y},{x: x+28, y: y-70},{x: x+40, y: y-70},{x: x+13, y: y}]),
                    @polyFixtureDef(path: [{x: x+26, y: y-32},{x: x+21, y: y-20},{x: x+34, y: y-20},{x: x+34, y: y-32}])
                ]
            @createPoly
                fixtureDefs: [
                    @polyFixtureDef(path: [{x: x+40, y: y-70},{x: x+34, y: y-54},{x: x+56, y: y},{x: x+70, y: y}]),
                    @polyFixtureDef(path: [{x: x+34, y: y-32},{x: x+34, y: y-20},{x: x+47, y: y-20},{x: x+43, y: y-32}])
                ]
        when "A"
            @createPoly
                fixtureDefs: [
                    @polyFixtureDef(path: [{x: x, y: y},{x: x+33, y: y-90},{x: x+48, y: y-90},{x: x+13, y: y}]),
                    @polyFixtureDef(path: [{x: x+26, y: y-32},{x: x+22, y: y-20},{x: x+42, y: y-20},{x: x+42, y: y-32}])
                ]
            @createPoly
                fixtureDefs: [
                    @polyFixtureDef(path: [{x: x+48, y: y-90},{x: x+42, y: y-73},{x: x+64, y: y},{x: x+78, y: y}]),
                    @polyFixtureDef(path: [{x: x+42, y: y-32},{x: x+42, y: y-20},{x: x+57, y: y-20},{x: x+54, y: y-32}])
                ]
        when "b"
            @createBox x: x+25, y: y-65, width: 25, height: 5    
            @createBox x: x+5,  y: y-35, width: 5,  height: 25   
            @createBox x: x+45, y: y-20, width: 5,  height: 10   
            @createBox x: x+35, y: y-35, width: 10, height: 5    
            @createBox x: x+45, y: y-50, width: 5,  height: 10   
            @createBox x: x+25, y: y-5,  width: 25, height: 5             
        when "B"
            @createBox x: x+30, y: y-85, width: 30, height: 5
            @createBox x: x+10, y: y-45, width: 10, height: 35
            @createBox x: x+55, y: y-25, width: 5,  height: 15
            @createBox x: x+40, y: y-45, width: 15, height: 5
            @createBox x: x+55, y: y-65, width: 5,  height: 15
            @createBox x: x+30, y: y-5,  width: 30, height: 5
        when "c"
            @createBox x: x+25, y: y-5,  width: 25, height: 5              
            @createBox x: x+10, y: y-35, width: 10, height: 25             
            @createBox x: x+25, y: y-65, width: 25, height: 5              
            @createBox x: x+4,  y: y-74, width: 6,  height: 2, density: 10 
        when "C"
            @createBox x: x+30, y: y-5,  width: 30, height: 5                  
            @createBox x: x+10, y: y-45, width: 10, height: 35               
            @createBox x: x+30, y: y-85, width: 30, height: 5                
            @createBox x: x+6,  y: y-92, width: 8,  height: 2, density: 10   
        when "d"                      
            @createBox x: x+20, y: y-5,  width: 20, height: 5
            @createBox x: x+5,  y: y-35, width: 5,  height: 25
            @createBox x: x+35, y: y-35, width: 5,  height: 25
            @createBox x: x+20, y: y-65, width: 20, height: 5
        when "D"                      
            @createBox x: x+30, y: y-5,  width: 30, height: 5
            @createBox x: x+5,  y: y-45, width: 5, height: 35
            @createBox x: x+55, y: y-45, width: 5, height: 35
            @createBox x: x+30, y: y-85, width: 30, height: 5
        when "e"
            @createBox x: x+25, y: y-5,  width: 25, height: 5              
            @createBox x: x+10, y: y-20, width: 10, height: 10             
            @createBox x: x+20, y: y-35, width: 20, height: 5              
            @createBox x: x+10, y: y-50, width: 10, height: 10             
            @createBox x: x+25, y: y-65, width: 25, height: 5              
            @createBox x: x+4,  y: y-74, width: 6,  height: 2, density: 10 
        when "E"
            @createBox x: x+30, y: y-5,  width: 30, height: 5               
            @createBox x: x+10, y: y-25, width: 10, height: 15              
            @createBox x: x+20, y: y-45, width: 20, height: 5               
            @createBox x: x+10, y: y-65, width: 10, height: 15              
            @createBox x: x+30, y: y-85, width: 30, height: 5               
            @createBox x: x+4,  y: y-91, width: 6,  height: 2, density: 10  
        when "f"
            @createBox x: x+10, y: y-15, width: 10, height: 15, density: 10 
            @createBox x: x+20, y: y-35, width: 20, height: 5                  
            @createBox x: x+10, y: y-50, width: 10, height: 10                 
            @createBox x: x+25, y: y-65, width: 25, height: 5                  
            @createBox x: x+4,  y: y-74, width: 6,  height: 2,  density: 10    
        when "F"
            @createBox x: x+10, y: y-20, width: 10, height: 20, density: 10              
            @createBox x: x+20, y: y-45, width: 20, height: 5                
            @createBox x: x+10, y: y-65, width: 10, height: 15               
            @createBox x: x+30, y: y-85, width: 30, height: 5                
            @createBox x: x+4,  y: y-91, width: 6,  height: 2,  density: 10  
        when "g"
            @createBox x: x+25, y: y-65, width: 25, height: 5              
            @createBox x: x+7,  y: y-35, width: 7,  height: 25             
            @createBox x: x+45, y: y-20, width: 5,  height: 10             
            @createBox x: x+35, y: y-35, width: 15, height: 5              
            @createBox x: x+45, y: y-40, width: 6,  height: 2, density: 10 
            @createBox x: x+25, y: y-5,  width: 25, height: 5              
            @createBox x: x+5,  y: y-74, width: 8,  height: 2, density: 10 
        when "G"
            @createBox x: x+30, y: y-85, width: 30, height: 5              
            @createBox x: x+10, y: y-45, width: 10, height: 35             
            @createBox x: x+55, y: y-25, width: 5,  height: 15             
            @createBox x: x+45, y: y-45, width: 15, height: 5              
            @createBox x: x+55, y: y-52, width: 6,  height: 2, density: 10 
            @createBox x: x+30, y: y-5,  width: 30, height: 5              
            @createBox x: x+5,  y: y-92, width: 8,  height: 2, density: 10 
        when "h"
            @createBox x: x+5,  y: y-15, width: 5,  height: 15 
            @createBox x: x+35, y: y-15, width: 5,  height: 15 
            @createBox x: x+20, y: y-35, width: 20, height: 5  
            @createBox x: x+5,  y: y-55, width: 5,  height: 15 
            @createBox x: x+35, y: y-55, width: 5,  height: 15 
        when "H"
            @createBox x: x+10, y: y-20, width: 10, height: 20 
            @createBox x: x+50, y: y-20, width: 10, height: 20 
            @createBox x: x+30, y: y-45, width: 30, height: 5  
            @createBox x: x+10, y: y-70, width: 10, height: 20 
            @createBox x: x+50, y: y-70, width: 10, height: 20
        when "i"
            @createBox x: x+25, y: y-5,  width: 25, height: 5  
            @createBox x: x+25, y: y-35, width: 5,  height: 25 
            @createBox x: x+25, y: y-65, width: 25, height: 5  
        when "I"
            @createBox x: x+30, y: y-5,  width: 30, height: 5  
            @createBox x: x+30, y: y-45, width: 5,  height: 35 
            @createBox x: x+30, y: y-85, width: 30, height: 5  
        when "j"
            @createBox x: x+15, y: y-5,  width: 15, height: 5  
            @createBox x: x+4,  y: y-18, width: 5,  height: 8  
            @createBox x: x+25, y: y-35, width: 5,  height: 25 
            @createBox x: x+25, y: y-65, width: 25, height: 5  
        when "J"
            @createBox x: x+17, y: y-5,  width: 18, height: 5  
            @createBox x: x+4,  y: y-18, width: 5,  height: 8  
            @createBox x: x+30, y: y-40, width: 5,  height: 35 
            @createBox x: x+30, y: y-85, width: 30, height: 5  
        when "k"
            @createPoly
                fixtureDefs: [
                    @polyFixtureDef(path: [{x: x, y: y},{x: x, y: y-70},{x: x+10, y: y-70},{x: x+10, y: y}]),
                    @polyFixtureDef(path: [{x: x+10, y: y-30},{x: x+10, y: y-40},{x: x+40, y: y-70},{x: x+50, y: y-70}])
                ]
            @createPoly
                path: [{x: x+10, y: y-30},{x: x+15, y: y-35},{x: x+50, y: y},{x: x+40, y: y}]
        when "K"
            @createPoly
                fixtureDefs: [
                    @polyFixtureDef(path: [{x: x, y: y},{x: x, y: y-90},{x: x+10, y: y-90},{x: x+10, y: y}]),
                    @polyFixtureDef(path: [{x: x+10, y: y-40},{x: x+10, y: y-50},{x: x+50, y: y-90},{x: x+60, y: y-90}])
                ]
            @createPoly
                path: [{x: x+10, y: y-40},{x: x+15, y: y-45},{x: x+60, y: y},{x: x+50, y: y}]
        when "l"
            @createBox x: x+20, y: y-5,  width: 20, height: 5
            @createBox x: x+5,  y: y-40, width: 5,  height: 30
        when "L"
            @createBox x: x+30, y: y-5,  width: 30, height: 5
            @createBox x: x+5,  y: y-50, width: 5,  height: 40
        when "m"
            @createPoly
                fixtureDefs: [
                    @polyFixtureDef(path: [{x: x, y: y},{x: x, y: y-70},{x: x+10, y: y-70},{x: x+10, y: y}]),
                    @polyFixtureDef(path: [{x: x+10, y: y-55},{x: x+10, y: y-70},{x: x+25, y: y-40},{x: x+25, y: y-25}])
                ]
            @createPoly
                fixtureDefs: [
                    @polyFixtureDef(path: [{x: x+40, y: y},{x: x+40, y: y-70},{x: x+50, y: y-70},{x: x+50, y: y}]),
                    @polyFixtureDef(path: [{x: x+25, y: y-25},{x: x+25, y: y-40},{x: x+40, y: y-70},{x: x+40, y: y-55}])
                ]
        when "M"
            @createPoly
                fixtureDefs: [
                    @polyFixtureDef(path: [{x: x, y: y},{x: x, y: y-90},{x: x+10, y: y-90},{x: x+10, y: y}]),
                    @polyFixtureDef(path: [{x: x+10, y: y-75},{x: x+10, y: y-90},{x: x+30, y: y-60},{x: x+30, y: y-45}])
                ]
            @createPoly
                fixtureDefs: [
                    @polyFixtureDef(path: [{x: x+50, y: y},{x: x+50, y: y-90},{x: x+60, y: y-90},{x: x+60, y: y}]),
                    @polyFixtureDef(path: [{x: x+30, y: y-45},{x: x+30, y: y-60},{x: x+50, y: y-90},{x: x+50, y: y-75}])
                ]
        when "n"
            @createPoly
                fixtureDefs: [
                    @polyFixtureDef(path: [{x: x, y: y},{x: x, y: y-70},{x: x+10, y: y-70},{x: x+10, y: y}]),
                    @polyFixtureDef(path: [{x: x+10, y: y-70},{x: x+10, y: y-55},{x: x+40, y: y},{x: x+40, y: y-15}])
                ]
            @createPoly
                path: [{x: x+40, y: y},{x: x+40, y: y-70},{x: x+50, y: y-70},{x: x+50, y: y}]
        when "N"
            @createPoly
                fixtureDefs: [
                    @polyFixtureDef(path: [{x: x, y: y},{x: x, y: y-90},{x: x+10, y: y-90},{x: x+10, y: y}]),
                    @polyFixtureDef(path: [{x: x+10, y: y-90},{x: x+10, y: y-75},{x: x+50, y: y},{x: x+50, y: y-15}])
                ]
            @createPoly
                path: [{x: x+50, y: y},{x: x+50, y: y-90},{x: x+60, y: y-90},{x: x+60, y: y}]
        when "o"
            @createBox x: x+20, y: y-5,  width: 20, height: 5
            @createBox x: x+5,  y: y-35, width: 5, height: 25
            @createBox x: x+35, y: y-35, width: 5, height: 25
            @createBox x: x+20, y: y-65, width: 20, height: 5
        when "O"
            @createBox x: x+30, y: y-5,  width: 30, height: 5
            @createBox x: x+5,  y: y-45, width: 5, height: 35
            @createBox x: x+55, y: y-45, width: 5, height: 35
            @createBox x: x+30, y: y-85, width: 30, height: 5
        when "p"
            @createBox x: x+17, y: y-30, width: 5,  height: 30
            @createPoly
                fixtureDefs: [
                    @polyFixtureDef(path: [{x: x, y: y-60},{x: x, y: y-70},{x: x+50, y: y-70},{x: x+50, y: y-60}]),
                    @polyFixtureDef(path: [{x: x+50, y: y-60},{x: x+50, y: y-40},{x: x+40, y: y-40},{x: x+40, y: y-60}]),
                    @polyFixtureDef(path: [{x: x+50, y: y-40},{x: x+50, y: y-30},{x: x+22, y: y-30},{x: x+22, y: y-40}])
                ]
            @createBox x: x+4,  y: y-72, width: 6,  height: 2, density: 10
        when "P"
            @createBox x: x+17, y: y-40, width: 5,  height: 40
            @createPoly
                fixtureDefs: [
                    @polyFixtureDef(path: [{x: x, y: y-80},{x: x, y: y-90},{x: x+60, y: y-90},{x: x+60, y: y-80}]),
                    @polyFixtureDef(path: [{x: x+60, y: y-80},{x: x+60, y: y-50},{x: x+50, y: y-50},{x: x+50, y: y-80}]),
                    @polyFixtureDef(path: [{x: x+60, y: y-50},{x: x+60, y: y-40},{x: x+22, y: y-40},{x: x+22, y: y-50}])
                ]
            @createBox x: x+4,  y: y-92, width: 6,  height: 2, density: 30
        when "q"
            @createBox x: x+25, y: y-5,  width: 25, height: 5
            @createBox x: x+5,  y: y-35, width: 5, height: 25
            @createPoly
                fixtureDefs: [
                    @polyFixtureDef(path: [{x: x+40, y: y-10},{x: x+40, y: y-60},{x: x+50, y: y-60},{x: x+50, y: y-10}]),                   
                    @polyFixtureDef(path: [{x: x+20, y: y-40},{x: x+30, y: y-40},{x: x+40, y: y-20},{x: x+40, y: y-10},{x: x+35, y: y-10}])
                ]
            @createBox x: x+25, y: y-65, width: 25, height: 5
        when "Q"
            @createBox x: x+30, y: y-5,  width: 30, height: 5
            @createBox x: x+5,  y: y-40, width: 5, height: 30
            @createPoly
                fixtureDefs: [
                    @polyFixtureDef(path: [{x: x+50, y: y-10},{x: x+50, y: y-70},{x: x+60, y: y-70},{x: x+60, y: y-10}]),                  
                    @polyFixtureDef(path: [{x: x+30, y: y-40},{x: x+40, y: y-40},{x: x+50, y: y-20},{x: x+50, y: y-10},{x: x+45, y: y-10}])
                ]
            @createBox x: x+30, y: y-75, width: 30, height: 5
        when "r"       
            @createBox x: x+5,  y: y-20, width: 5,  height: 30 
            @createBox x: x+28, y: y-5,  width: 5,  height: 15 
            @createBox x: x+25, y: y-25, width: 15, height: 5 
            @createBox x: x+35, y: y-40, width: 5,  height: 10 
            @createBox x: x+20, y: y-55, width: 20, height: 5 
        when "R"
            @createBox x: x+5,  y: y-40, width: 5,  height: 40  
            @createBox x: x+35, y: y-20, width: 5,  height: 20  
            @createBox x: x+35, y: y-45, width: 25, height: 5   
            @createBox x: x+55, y: y-65, width: 5,  height: 15  
            @createBox x: x+30, y: y-85, width: 30, height: 5   
        when "s"
            @createBox x: x+25, y: y-5,  width: 25, height: 5              
            @createBox x: x+40, y: y-20, width: 10, height: 10             
            @createBox x: x+25, y: y-35, width: 25, height: 5              
            @createBox x: x+47, y: y-42, width: 6,  height: 2, density: 50 
            @createBox x: x+10, y: y-50, width: 10, height: 10             
            @createBox x: x+25, y: y-65, width: 25, height: 5              
            @createBox x: x+4,  y: y-72, width: 6,  height: 2, density: 10 
        when "S"
            @createBox x: x+30, y: y-5,   width: 30, height: 5                
            @createBox x: x+50,  y: y-25, width: 10, height: 15               
            @createBox x: x+30, y: y-45,  width: 30, height: 5                
            @createBox x: x+57,  y: y-52, width: 6,  height: 2, density: 80   
            @createBox x: x+10,  y: y-65, width: 10, height: 15               
            @createBox x: x+30, y: y-85, width: 30,  height: 5                
            @createBox x: x+4,  y: y-92, width: 6,   height: 2, density: 10      
        when "t"
            @createBox x: x+25, y: y-30, width: 5,  height: 30 
            @createBox x: x+25, y: y-60, width: 25, height: 5  
        when "T"
            @createBox x: x+30, y: y-40, width: 5,  height: 40 
            @createBox x: x+30, y: y-80, width: 30, height: 5  
        when "u"
            @createBox x: x+20, y: y-5,  width: 20, height: 5
            @createBox x: x+5,  y: y-40, width: 5,  height: 30
            @createBox x: x+35,  y: y-40, width: 5,  height: 30
        when "U"
            @createBox x: x+30, y: y-5,  width: 30, height: 5
            @createBox x: x+5,  y: y-50, width: 5,  height: 40
            @createBox x: x+55,  y: y-50, width: 5,  height: 40
        when "v"
            @createPoly
                fixtureDefs: [
                    @polyFixtureDef(path: [{x: x, y: y-70}, {x: x+10, y: y-70}, {x: x+25, y: y-20}, {x: x+25, y: y}]),                  
                    @polyFixtureDef(path: [{x: x+25, y: y}, {x: x+25, y: y-20}, {x: x+40, y: y-70}, {x: x+50, y: y-70}])                  
                ]
        when "V"
            @createPoly
                fixtureDefs: [
                    @polyFixtureDef(path: [{x: x, y: y-90}, {x: x+10, y: y-90}, {x: x+30, y: y-20}, {x: x+30, y: y}]),                  
                    @polyFixtureDef(path: [{x: x+30, y: y}, {x: x+30, y: y-20}, {x: x+50, y: y-90}, {x: x+60, y: y-90}])                  
                ]
        when "w"
            @createBox x: x+25, y: y-5,  width: 25, height: 5  
            @createBox x: x+5,  y: y-40, width: 5,  height: 30 
            @createBox x: x+45, y: y-40, width: 5,  height: 30 
            @createBox x: x+25, y: y-25, width: 5,  height: 15 
        when "W"       
            @createBox x: x+40, y: y-5,  width: 40, height: 5
            @createBox x: x+10, y: y-45, width: 10, height: 40
            @createBox x: x+70, y: y-45, width: 10, height: 40
            @createBox x: x+40, y: y-20, width: 5,  height: 15
        when "x"
            @createPoly
                fixtureDefs: [
                    @polyFixtureDef(path: [{x: x, y: y}, {x: x+20, y: y-35}, {x: x+30, y: y-35}, {x: x+10, y: y}])                 
                ]
            @createPoly
                fixtureDefs: [
                    @polyFixtureDef(path: [{x: x+30, y: y-35}, {x: x+50, y: y}, {x: x+40, y: y}, {x: x+25, y: y-25}])                  
                ]
            @createPoly
                fixtureDefs: [
                    @polyFixtureDef(path: [{x: x, y: y-70}, {x: x+10, y: y-70}, {x: x+30, y: y-35}, {x: x+20, y: y-35}]),                  
                    @polyFixtureDef(path: [{x: x+25, y: y-45}, {x: x+40, y: y-70}, {x: x+50, y: y-70}, {x: x+30, y: y-35}])                  
                ]
        when "X"
            @createPoly
                fixtureDefs: [
                    @polyFixtureDef(path: [{x: x, y: y}, {x: x+25, y: y-45}, {x: x+35, y: y-45}, {x: x+10, y: y}])                 
                ] 
            @createPoly
                fixtureDefs: [
                    @polyFixtureDef(path: [{x: x+35, y: y-45}, {x: x+60, y: y}, {x: x+50, y: y}, {x: x+30, y: y-35}])                  
                ]
            @createPoly
                fixtureDefs: [
                    @polyFixtureDef(path: [{x: x, y: y-90}, {x: x+10, y: y-90}, {x: x+35, y: y-45}, {x: x+25, y: y-45}]),                  
                    @polyFixtureDef(path: [{x: x+30, y: y-55}, {x: x+50, y: y-90}, {x: x+60, y: y-90}, {x: x+35, y: y-45}])                  
                ]
        when "y"
            @createPoly
                fixtureDefs: [
                    @polyFixtureDef(path: [{x: x, y: y-70}, {x: x+10, y: y-70}, {x: x+30, y: y-35}, {x: x+20, y: y-35}]),                  
                    @polyFixtureDef(path: [{x: x+25, y: y-45}, {x: x+40, y: y-70}, {x: x+50, y: y-70}, {x: x+30, y: y-35}])                  
                ]
            @createBox x: x+25, y: y-17,  width: 5, height: 17
        when "Y"
            @createPoly
                fixtureDefs: [
                    @polyFixtureDef(path: [{x: x, y: y-90}, {x: x+10, y: y-90}, {x: x+35, y: y-45}, {x: x+25, y: y-45}]),                  
                    @polyFixtureDef(path: [{x: x+30, y: y-55}, {x: x+50, y: y-90}, {x: x+60, y: y-90}, {x: x+35, y: y-45}])                  
                ]
            @createBox x: x+30, y: y-22,  width: 5, height: 22
        when "z"
            @createPoly
                fixtureDefs: [
                    @polyFixtureDef(path: [{x: x, y: y}, {x: x, y: y-10}, {x: x+50, y: y-10}, {x: x+50, y: y}]),                  
                    @polyFixtureDef(path: [{x: x, y: y-10}, {x: x+40, y: y-60}, {x: x+50, y: y-60}, {x: x+10, y: y-10}])                  
                ]
            @createBox x: x+25, y: y-65,  width: 25, height: 5
            @createBox x: x+47, y: y-72, width: 6,  height: 2, density: 50
        when "Z"
            @createPoly
                fixtureDefs: [
                    @polyFixtureDef(path: [{x: x, y: y}, {x: x, y: y-10}, {x: x+60, y: y-10}, {x: x+60, y: y}]),                  
                    @polyFixtureDef(path: [{x: x, y: y-10}, {x: x+50, y: y-90}, {x: x+60, y: y-90}, {x: x+10, y: y-10}])                  
                ]
            @createBox x: x+30, y: y-95,  width: 30, height: 5
            @createBox x: x+57, y: y-102, width: 6,  height: 2, density: 50
        else 
            return

peanutty.createLetters
    x: peanutty.canvas.width() / 2
    y: peanutty.canvas.height() - 55
    letters: 'Hello World'
