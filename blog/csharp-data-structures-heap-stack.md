---
title: "Back to Basics: C# Data Structures, Stack & Heap"
date: 2025-12-22
description: "A comprehensive guide to data structures in C#. Learn the difference between value and reference types, understand stack vs heap memory, and master both basic and advanced data structures."
tags: ["C#", ".NET", "Data Structures", "Back to Basics"]
author: "Antonio Supan"
---

# Back to Basics: C# Data Structures, Stack & Heap

Understanding data structures and memory management is fundamental to writing efficient C# code. This article covers everything from basic collections to advanced data structures, and demystifies how the stack and heap work in .NET.

## Stack vs Heap: Memory Fundamentals

Before diving into data structures, let's understand where our data lives in memory.

### The Stack

The stack is a LIFO (Last In, First Out) memory structure used for:

- **Value types** (int, double, bool, struct)
- **Method parameters and local variables**
- **References to objects** (not the objects themselves)

```csharp
void CalculateSum()
{
    int a = 10;      // Stored on stack
    int b = 20;      // Stored on stack
    int sum = a + b; // Stored on stack
} // All variables are automatically removed when method exits
```

**Stack characteristics:**

- Fast allocation and deallocation
- Automatic memory management (no garbage collection needed)
- Limited size (typically 1MB per thread)
- Memory is freed when the scope ends

### The Heap

The heap is used for:

- **Reference types** (classes, arrays, strings, delegates)
- **Objects that need to outlive the current scope**
- **Dynamically sized data**

```csharp
void CreatePerson()
{
    // 'person' reference is on the stack
    // The actual Person object is on the heap
    Person person = new Person("Antonio", 30);
}
```

**Heap characteristics:**

- Slower allocation than stack
- Managed by the Garbage Collector
- Larger size (limited by system memory)
- Objects persist until no references exist

### Visual Representation

```
STACK                          HEAP
┌─────────────────┐           ┌─────────────────────────┐
│ int x = 42      │           │                         │
├─────────────────┤           │  ┌─────────────────┐   │
│ bool flag = true│           │  │ Person Object   │   │
├─────────────────┤           │  │ Name: "Antonio" │   │
│ person (ref) ───┼───────────┼─►│ Age: 30         │   │
├─────────────────┤           │  └─────────────────┘   │
│ numbers (ref) ──┼───────────┼─►┌─────────────────┐   │
└─────────────────┘           │  │ int[] {1,2,3}   │   │
                              │  └─────────────────┘   │
                              └─────────────────────────┘
```

## Value Types vs Reference Types

### Value Types (Stack)

```csharp
// Primitives
int number = 42;
double price = 19.99;
bool isActive = true;
char letter = 'A';

// Structs
DateTime now = DateTime.Now;
Guid id = Guid.NewGuid();
Point point = new Point(10, 20);

// Custom struct
public struct Coordinate
{
    public double Latitude { get; init; }
    public double Longitude { get; init; }
}
```

**Value type behavior:**

```csharp
int a = 10;
int b = a;  // b gets a COPY of the value
b = 20;

Console.WriteLine(a); // Output: 10 (unchanged)
Console.WriteLine(b); // Output: 20
```

### Reference Types (Heap)

```csharp
// Classes
Person person = new Person();
List<int> numbers = new List<int>();

// Strings (special case - immutable)
string name = "Antonio";

// Arrays
int[] scores = new int[5];
```

**Reference type behavior:**

```csharp
Person personA = new Person { Name = "Antonio" };
Person personB = personA;  // Both point to the SAME object
personB.Name = "Marco";

Console.WriteLine(personA.Name); // Output: Marco (changed!)
Console.WriteLine(personB.Name); // Output: Marco
```

## Basic Data Structures

### Arrays

Fixed-size, zero-indexed collections with O(1) access time.

```csharp
// Declaration and initialization
int[] numbers = new int[5];
string[] names = { "Alice", "Bob", "Charlie" };
int[,] matrix = new int[3, 3]; // 2D array

// Access and modification
numbers[0] = 10;
int first = names[0];

// Iteration
foreach (var name in names)
{
    Console.WriteLine(name);
}

// Useful methods
Array.Sort(numbers);
Array.Reverse(numbers);
int index = Array.IndexOf(names, "Bob");
bool exists = Array.Exists(names, n => n.StartsWith("A"));
```

**When to use:** Fixed-size collections where you know the size upfront and need fast index-based access.

### List\<T\>

Dynamic arrays that grow automatically.

```csharp
var numbers = new List<int> { 1, 2, 3 };

// Adding elements
numbers.Add(4);              // Add to end: O(1) amortized
numbers.Insert(0, 0);        // Insert at index: O(n)
numbers.AddRange(new[] { 5, 6, 7 });

// Removing elements
numbers.Remove(3);           // Remove first occurrence: O(n)
numbers.RemoveAt(0);         // Remove at index: O(n)
numbers.RemoveAll(n => n > 5); // Remove matching: O(n)

// Searching
bool contains = numbers.Contains(2);  // O(n)
int index = numbers.IndexOf(2);       // O(n)
int found = numbers.Find(n => n > 3); // O(n)

// Capacity management
numbers.Capacity = 100;  // Pre-allocate
numbers.TrimExcess();    // Release unused memory
```

**When to use:** When you need a dynamic collection with frequent access by index.

### Dictionary\<TKey, TValue\>

Hash table implementation with O(1) average lookup.

```csharp
var users = new Dictionary<int, string>
{
    [1] = "Alice",
    [2] = "Bob"
};

// Adding entries
users.Add(3, "Charlie");      // Throws if key exists
users[4] = "Diana";           // Adds or updates
users.TryAdd(5, "Eve");       // Returns false if key exists

// Accessing values
string name = users[1];                    // Throws if not found
bool found = users.TryGetValue(1, out var value);  // Safe access

// Checking and removing
bool hasKey = users.ContainsKey(1);
bool hasValue = users.ContainsValue("Alice");
users.Remove(1);

// Iteration
foreach (var kvp in users)
{
    Console.WriteLine($"{kvp.Key}: {kvp.Value}");
}
```

**When to use:** Fast key-based lookups, caching, counting occurrences.

### HashSet\<T\>

Collection of unique elements with O(1) lookup.

```csharp
var tags = new HashSet<string> { "csharp", "dotnet", "programming" };

// Operations
tags.Add("azure");        // Returns true if added
tags.Remove("csharp");    // Returns true if removed
bool has = tags.Contains("dotnet");  // O(1) lookup

// Set operations
var otherTags = new HashSet<string> { "dotnet", "cloud", "azure" };

tags.UnionWith(otherTags);        // Combine sets
tags.IntersectWith(otherTags);    // Keep common elements
tags.ExceptWith(otherTags);       // Remove other's elements
tags.SymmetricExceptWith(otherTags); // Keep unique to each

// Comparison
bool isSubset = tags.IsSubsetOf(otherTags);
bool overlaps = tags.Overlaps(otherTags);
```

**When to use:** Ensuring uniqueness, fast membership testing, set operations.

## Advanced Data Structures

### Stack\<T\>

LIFO (Last In, First Out) collection.

```csharp
var history = new Stack<string>();

// Operations
history.Push("page1.html");  // Add to top
history.Push("page2.html");
history.Push("page3.html");

string current = history.Peek();  // View top without removing
string back = history.Pop();      // Remove and return top

bool hasItems = history.TryPop(out var page);  // Safe pop
bool canPeek = history.TryPeek(out var top);   // Safe peek
```

**Real-world uses:**

- Browser history (back button)
- Undo/Redo functionality
- Expression evaluation
- Call stack simulation

```csharp
// Example: Balanced parentheses checker
bool IsBalanced(string expression)
{
    var stack = new Stack<char>();
    var pairs = new Dictionary<char, char>
    {
        ['('] = ')',
        ['['] = ']',
        ['{'] = '}'
    };

    foreach (char c in expression)
    {
        if (pairs.ContainsKey(c))
        {
            stack.Push(c);
        }
        else if (pairs.ContainsValue(c))
        {
            if (stack.Count == 0 || pairs[stack.Pop()] != c)
                return false;
        }
    }

    return stack.Count == 0;
}
```

### Queue\<T\>

FIFO (First In, First Out) collection.

```csharp
var tasks = new Queue<string>();

// Operations
tasks.Enqueue("Task 1");  // Add to end
tasks.Enqueue("Task 2");
tasks.Enqueue("Task 3");

string next = tasks.Peek();     // View first without removing
string current = tasks.Dequeue(); // Remove and return first

bool hasItems = tasks.TryDequeue(out var task);  // Safe dequeue
```

**Real-world uses:**

- Task processing
- Print spooler
- Message queues
- BFS (Breadth-First Search)

```csharp
// Example: Simple task processor
async Task ProcessTasksAsync(Queue<Func<Task>> taskQueue)
{
    while (taskQueue.TryDequeue(out var task))
    {
        await task();
        Console.WriteLine($"Processed. Remaining: {taskQueue.Count}");
    }
}
```

### PriorityQueue\<TElement, TPriority\>

Queue where elements are dequeued by priority (introduced in .NET 6).

```csharp
var emergencyRoom = new PriorityQueue<string, int>();

// Lower number = higher priority
emergencyRoom.Enqueue("Broken arm", 3);
emergencyRoom.Enqueue("Heart attack", 1);
emergencyRoom.Enqueue("Headache", 5);
emergencyRoom.Enqueue("Stroke", 1);

while (emergencyRoom.TryDequeue(out var patient, out var priority))
{
    Console.WriteLine($"Treating: {patient} (Priority: {priority})");
}
// Output:
// Treating: Heart attack (Priority: 1)
// Treating: Stroke (Priority: 1)
// Treating: Broken arm (Priority: 3)
// Treating: Headache (Priority: 5)
```

**Real-world uses:**

- Task scheduling
- Dijkstra's algorithm
- Event-driven simulation
- A* pathfinding

### LinkedList\<T\>

Doubly-linked list for efficient insertions/deletions.

```csharp
var playlist = new LinkedList<string>();

// Adding nodes
playlist.AddFirst("Song 1");
playlist.AddLast("Song 3");

var node = playlist.Find("Song 1");
playlist.AddAfter(node!, "Song 2");

// Navigation
LinkedListNode<string>? current = playlist.First;
while (current != null)
{
    Console.WriteLine(current.Value);
    current = current.Next;  // Or .Previous for backward
}

// Removal
playlist.Remove("Song 2");
playlist.RemoveFirst();
playlist.RemoveLast();
```

**When to use:** Frequent insertions/deletions at arbitrary positions, when you don't need index-based access.

### SortedSet\<T\> and SortedDictionary\<TKey, TValue\>

Self-balancing binary search trees (Red-Black trees).

```csharp
var sortedNumbers = new SortedSet<int> { 5, 2, 8, 1, 9 };
// Always maintained in sorted order: 1, 2, 5, 8, 9

// Range operations
var range = sortedNumbers.GetViewBetween(2, 8); // 2, 5, 8

// Min/Max operations
int min = sortedNumbers.Min;  // 1
int max = sortedNumbers.Max;  // 9

// SortedDictionary
var sortedUsers = new SortedDictionary<string, int>
{
    ["Charlie"] = 25,
    ["Alice"] = 30,
    ["Bob"] = 28
};

// Iteration is always in key order: Alice, Bob, Charlie
foreach (var kvp in sortedUsers)
{
    Console.WriteLine($"{kvp.Key}: {kvp.Value}");
}
```

**When to use:** When you need sorted iteration, range queries, or min/max operations.

## Thread-Safe Collections

For concurrent scenarios, use collections from `System.Collections.Concurrent`:

```csharp
using System.Collections.Concurrent;

// Thread-safe dictionary
var cache = new ConcurrentDictionary<string, object>();
cache.TryAdd("key", "value");
var value = cache.GetOrAdd("key", k => ComputeValue(k));
cache.AddOrUpdate("key", "new", (k, old) => "updated");

// Thread-safe queue
var queue = new ConcurrentQueue<Task>();
queue.Enqueue(task);
queue.TryDequeue(out var item);

// Thread-safe stack
var stack = new ConcurrentStack<int>();
stack.Push(1);
stack.TryPop(out var top);

// Thread-safe bag (unordered)
var bag = new ConcurrentBag<string>();
bag.Add("item");
bag.TryTake(out var taken);

// Blocking collection (producer-consumer)
var blocking = new BlockingCollection<int>(boundedCapacity: 100);
blocking.Add(1);            // Blocks if full
var item = blocking.Take(); // Blocks if empty
```

## Choosing the Right Data Structure

| Need | Use | Time Complexity |
|------|-----|-----------------|
| Index-based access | `Array` / `List<T>` | O(1) |
| Key-based lookup | `Dictionary<K,V>` | O(1) average |
| Uniqueness | `HashSet<T>` | O(1) average |
| Sorted data | `SortedSet<T>` | O(log n) |
| LIFO operations | `Stack<T>` | O(1) |
| FIFO operations | `Queue<T>` | O(1) |
| Priority-based | `PriorityQueue<E,P>` | O(log n) |
| Frequent insert/delete | `LinkedList<T>` | O(1)* |
| Thread safety | `Concurrent*` | Varies |

*At a known position

## Memory Optimization Tips

### Use Structs for Small Value Types

```csharp
// Good: Small, immutable, no inheritance needed
public readonly struct Point
{
    public int X { get; init; }
    public int Y { get; init; }
}

// Consider: record struct for even less boilerplate
public readonly record struct Coordinate(double Lat, double Lon);
```

### Use Span\<T\> and Memory\<T\> for Stack Allocation

```csharp
// Allocate on stack instead of heap
Span<int> numbers = stackalloc int[100];

// Slice without allocation
Span<int> slice = numbers[10..20];

// Parse without string allocation
ReadOnlySpan<char> text = "Hello, World!".AsSpan();
ReadOnlySpan<char> hello = text[..5]; // No new string created
```

### Pre-size Collections

```csharp
// Bad: Multiple resizes as list grows
var list = new List<int>();
for (int i = 0; i < 10000; i++)
    list.Add(i);

// Good: Single allocation
var list = new List<int>(capacity: 10000);
for (int i = 0; i < 10000; i++)
    list.Add(i);
```

### Use ArrayPool for Temporary Arrays

```csharp
using System.Buffers;

// Rent an array from the pool
int[] buffer = ArrayPool<int>.Shared.Rent(minimumLength: 1000);
try
{
    // Use the buffer
    ProcessData(buffer);
}
finally
{
    // Return to pool for reuse
    ArrayPool<int>.Shared.Return(buffer);
}
```

## Conclusion

Understanding data structures and memory management is crucial for writing efficient C# code. Remember:

- **Stack** is fast and automatic, used for value types and references
- **Heap** is flexible and garbage-collected, used for reference types
- Choose data structures based on your access patterns and performance needs
- Use thread-safe collections for concurrent scenarios
- Optimize memory with structs, spans, and pooling where appropriate

Mastering these fundamentals will help you write faster, more memory-efficient applications and make better architectural decisions in your .NET projects.
