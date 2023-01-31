import unittest
import programObjects

class MyTestCase(unittest.TestCase):
    def test_something(self):
        self.assertEqual(True, True)  # add assertion here
    def testAndT(self):
        in1=programObjects.testIn()
        in2=programObjects.testIn()
        p=programObjects.andObject()
        out=programObjects.testOut()
        p.addInput(in1)
        p.addInput(in2)
        out.addInput(p)

        in1.update(False)
        in1.update(True)
        in2.update(True)
        print(in1.output)
        print(in2.output)
        self.assertEqual(True,out.runOutput())


    def testAndF(self):
        in1=programObjects.testIn()
        in2=programObjects.testIn()
        p=programObjects.andObject()
        out=programObjects.testOut()
        p.addInput(in1)
        p.addInput(in2)
        out.addInput(p)

        in1.update(False)
        in1.update(True)
        in2.update(False)
        self.assertEqual(False,out.runOutput())

if __name__ == '__main__':
    unittest.main()
