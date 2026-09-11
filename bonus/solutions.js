// Solutions to the "Bonus Coding Problems" section of the assignment.
// Pure JS, no dependencies. Run with: node bonus/solutions.js

// ---------------------------------------------------------------------------
// 1. Two Sum — https://leetcode.com/problems/two-sum/  (Beginner)
// Time: O(n)  Space: O(n) — single pass with a hash map of value -> index.
// ---------------------------------------------------------------------------
function twoSum(nums, target) {
  const seenAt = new Map() // value -> index

  for (let i = 0; i < nums.length; i++) {
    const complement = target - nums[i]
    if (seenAt.has(complement)) {
      return [seenAt.get(complement), i]
    }
    seenAt.set(nums[i], i)
  }

  return []
}

// ---------------------------------------------------------------------------
// 2. Valid Parentheses — https://leetcode.com/problems/valid-parentheses/  (Beginner)
// Time: O(n)  Space: O(n) — stack of open brackets.
// ---------------------------------------------------------------------------
function isValid(s) {
  const closingToOpening = { ')': '(', ']': '[', '}': '{' }
  const stack = []

  for (const char of s) {
    if (char === '(' || char === '[' || char === '{') {
      stack.push(char)
    } else if (closingToOpening[char]) {
      if (stack.pop() !== closingToOpening[char]) return false
    }
  }

  return stack.length === 0
}

// ---------------------------------------------------------------------------
// 3. Longest Substring Without Repeating Characters
// https://leetcode.com/problems/longest-substring-without-repeating-characters/  (Intermediate)
// Time: O(n)  Space: O(min(n, alphabet size)) — sliding window with a map of
// each character's last seen index.
// ---------------------------------------------------------------------------
function lengthOfLongestSubstring(s) {
  const lastSeenAt = new Map()
  let windowStart = 0
  let longest = 0

  for (let end = 0; end < s.length; end++) {
    const char = s[end]
    if (lastSeenAt.has(char) && lastSeenAt.get(char) >= windowStart) {
      windowStart = lastSeenAt.get(char) + 1
    }
    lastSeenAt.set(char, end)
    longest = Math.max(longest, end - windowStart + 1)
  }

  return longest
}

// ---------------------------------------------------------------------------
// 4. Find the Missing Number — https://www.hackerrank.com/challenges/missing-numbers/problem  (Beginner)
// Given 1..n with exactly one number missing.
// Time: O(n)  Space: O(1) — Gauss's sum formula minus the actual sum.
// ---------------------------------------------------------------------------
function findMissingNumber(nums) {
  const n = nums.length + 1
  const expectedSum = (n * (n + 1)) / 2
  const actualSum = nums.reduce((sum, num) => sum + num, 0)
  return expectedSum - actualSum
}

// ---------------------------------------------------------------------------
// 5. Reverse a Linked List — https://leetcode.com/problems/reverse-linked-list/  (Intermediate)
// Time: O(n)  Space: O(1) — iterative pointer reversal.
// ---------------------------------------------------------------------------
class ListNode {
  constructor(val, next = null) {
    this.val = val
    this.next = next
  }
}

function reverseList(head) {
  let previous = null
  let current = head

  while (current !== null) {
    const next = current.next
    current.next = previous
    previous = current
    current = next
  }

  return previous
}

// Small helpers used only for the self-checks below.
function arrayToList(values) {
  let head = null
  for (let i = values.length - 1; i >= 0; i--) {
    head = new ListNode(values[i], head)
  }
  return head
}

function listToArray(head) {
  const values = []
  let node = head
  while (node !== null) {
    values.push(node.val)
    node = node.next
  }
  return values
}

// ---------------------------------------------------------------------------
// Self-checks against the examples given in the assignment.
// ---------------------------------------------------------------------------
console.log('1. Two Sum:', twoSum([2, 7, 11, 15], 9)) // [0, 1]
console.log('2. Valid Parentheses:', isValid('()[]{}')) // true
console.log('3. Longest Substring Without Repeating Characters:', lengthOfLongestSubstring('abcabcbb')) // 3
console.log('4. Find the Missing Number:', findMissingNumber([1, 2, 4, 5])) // 3
console.log('5. Reverse a Linked List:', listToArray(reverseList(arrayToList([1, 2, 3, 4, 5])))) // [5, 4, 3, 2, 1]

export { twoSum, isValid, lengthOfLongestSubstring, findMissingNumber, reverseList, ListNode, arrayToList, listToArray }
