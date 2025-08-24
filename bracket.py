"""
Here's the next one. This problem is a classic that tests your understanding of a fundamental data structure: the stack.

## 4. Data Validation: The "Valid Parentheses" Problem
Compilers and text editors need to check if brackets in code are matched correctly. This is a simplified version of that real-world problem.

The Problem:
Given a string s containing just the characters (, ), {, }, [ and ], determine if the input string is valid.

An input string is valid if:

Open brackets must be closed by the same type of brackets.

Open brackets must be closed in the correct order.

Examples:

Input: s = "()[]{}"

Output: True

Input: s = "(]"

Output: False

Input: s = "([)]"

Output: False

Input: s = "{[]}"

Output: True
"""
def validate(input):
    #brackets_open = ['(', '{', '[']
    #brackets_close = [')', '}', ']']
    brackets_open = "({["
    brackets_close = ")}]"
    stack = []
    # filter to just brackets
    input_filtered = []
    for c in input:
        if c in brackets_open or c in brackets_close:
            input_filtered.append(c)
    
    #print input_filtered
    # go through string and ensure brackets match
    for c in input_filtered:
       # print 'c: ' + c
        if c in brackets_open:
            #print 'append: ' + c
            stack.append(c)
        elif c in brackets_close:
            # need to find corresponding open bracket
            if len(stack):
                open_c = stack.pop(-1)
            else:
                return False
            #print 'pop: ' + open_c
            if brackets_open.find(open_c) != brackets_close.find(c):
                return False
    return len(stack) == 0

def test(input):
    print "result:" + str(validate(input))

test("(()")
