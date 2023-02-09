class programObject:
    output=True
    outputsTo=[]
    inputsFrom=[]
    inputs=[]
    def __init__(self):
        self.outputsTo=[]
        self.inputsFrom=[]
        self.inputs=[]
    def addOutputTo(self,to):
        self.outputsTo.append(to)
    def addInput(self,inputFrom):
        self.inputsFrom.append(inputFrom)
        inputFrom.addOutputTo(self)

    def getOutput(self):
        return self.output
    def updateOutputs(self):
        for output in self.outputsTo:
            output.update()
    def calculateOutput(self):
        pass
    def update(self):
        #get inputs
        self.inputs=[]
        for input in self.inputsFrom:
            self.inputs.append(input.getOutput())
        new=self.calculateOutput()
        if new!=self.output:
            self.output=new
            self.updateOutputs()


class outObject(programObject):
    def runOutput(self):
        pass

class testIn(programObject):
    def update(self,out):
        if out!=self.output:
            self.output=out
            self.updateOutputs()

class testOut(outObject):
    def calculateOutput(self):
        return self.inputs[0]
    def runOutput(self):
        return self.output

class orObject(programObject):
    def calculateOutput(self):
        for input in self.inputs:
            if input==True:
                return True
        return False

class andObject(programObject):
    def calculateOutput(self):
        for input in self.inputs:
            if input==False:
                return False
        return True

