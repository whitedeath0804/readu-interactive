***

### Why is it Useful to Use Derivatives for Analysis?

The first and second derivatives provide valuable information about the behavior of a function. By analyzing the derivatives, we can determine:

-   Where the function is increasing or decreasing.
-   Where the function has local maxima and minima.
-   Where the function changes concavity.
-   Where the points of inflection are.

These properties allow us to make well-reasoned conclusions about the function’s behavior, solve optimization problems, analyze graphs, and tackle various real-world applications.

***

### First Derivative and Analysis

The first derivative $$f ' ( x )$$ provides information about the rate of change of the function. By analyzing the sign of the first derivative, we can identify intervals where the function is increasing or decreasing and locate local extrema.

#### **Example 1: Analyzing Increasing and Decreasing Intervals**

Consider the function $$f ( x ) = x^{3} - 3 x^{2} + 2$$.

1.  **Find the First Derivative:**

    $$
    f ' ( x ) = 3 x^{2} - 6 x
    $$

2.  **Find the Critical Points:**

    $$
    3 x^{2} - 6 x = 0 \Longrightarrow 3 x ( x - 2 ) = 0 \Longrightarrow x = 0 \text{ or } x = 2
    $$

3.  **Analyze the Sign of the First Derivative:**
    -   For $$x < 0$$:

        $$
        f ' ( - 1 ) = 3 ( - 1 )^{2} - 6 ( - 1 ) = 3 + 6 = 9 > 0 \Longrightarrow \text{The function is increasing on the interval } ( - \infty , 0 )
        $$

    -   For $$0 < x < 2$$:

        $$
        f ' ( 1 ) = 3 ( 1 )^{2} - 6 ( 1 ) = 3 - 6 = - 3 < 0 \Longrightarrow \text{The function is decreasing on the interval } ( 0 , 2 )
        $$

    -   For $$x > 2$$:

        $$
        f ' ( 3 ) = 3 ( 3 )^{2} - 6 ( 3 ) = 27 - 18 = 9 > 0 \Longrightarrow \text{The function is increasing on the interval } ( 2 , \infty )
        $$

***

#### **Example 2: Finding Local Extrema**

For the same function $$f ( x ) = x^{3} - 3 x^{2} + 2$$:

1.  **Find the Function Values at the Critical Points:**

    $$
    f ( 0 ) = 0^{3} - 3 ( 0 )^{2} + 2 = 2
    $$

    $$
    f ( 2 ) = 2^{3} - 3 ( 2 )^{2} + 2 = 8 - 12 + 2 = - 2
    $$

2.  **Determine the Nature of the Critical Points:**
    -   At $$x = 0$$, the function changes from increasing to decreasing, so $$x = 0$$ is a **local maximum**.
    -   At $$x = 2$$, the function changes from decreasing to increasing, so $$x = 2$$ is a **local minimum**.

***

### Second Derivative and Analysis

The second derivative $$f '' ( x )$$ provides information about the concavity of the function and points of inflection. The second derivative test is used to determine the nature of critical points.

#### **Example 3: Analyzing Concavity**

Consider the function $$g ( x ) = x^{4} - 4 x^{3} + 6 x^{2}$$.

1.  **Find the First and Second Derivatives:**

    $$
    g ' ( x ) = 4 x^{3} - 12 x^{2} + 1 2 x
    $$

    $$
    g '' ( x ) = 12 x^{2} - 2 4 x + 12
    $$

2.  **Find the Critical Points of the First Derivative:**

    $$
    4 x^{3} - 12 x^{2} + 1 2 x = 0 \Longrightarrow 4 x \left( x^{2} - 3 x + 3 \right) = 0 \Longrightarrow x = 0 \text{ or } x = 1 . 5
    $$

3.  **Analyze the Sign of the Second Derivative:**
    -   For $$x < 1$$:

        $$
        g '' ( 0 . 5 ) = 12 ( 0 . 5 )^{2} - 24 ( 0 . 5 ) + 12 = 3 - 12 + 12 = 3 > 0 \Longrightarrow \text{The function is concave upward on the interval } ( - \infty , 1 )
        $$

    -   For $$x > 1$$:

        $$
        g '' ( 2 ) = 12 ( 2 )^{2} - 24 ( 2 ) + 12 = 48 - 48 + 12 = 12 > 0 \Longrightarrow \text{The function is concave upward on the interval } ( 1 , \infty )
        $$

Therefore, the function is concave upward on the entire interval $$( - \infty , \infty )$$.

***

### Example 4: Second Derivative Test

For the same function $$g ( x ) = x^{4} - 4 x^{3} + 6 x^{2}$$:

1.  **Apply the Second Derivative Test:**
    -   At $$x = 0$$:

        $$
        g '' ( 0 ) = 12 ( 0 )^{2} - 24 ( 0 ) + 12 = 12 > 0 \Longrightarrow \text{There is a local minimum at } x = 0
        $$

    -   At $$x = 1 . 5$$:

        $$
        g '' ( 1 . 5 ) = 12 ( 1 . 5 )^{2} - 24 ( 1 . 5 ) + 12 = 12 > 0 \Longrightarrow \text{There is a local minimum at } x = 1 . 5
        $$

***

### Real-World Applications

#### **Example 5: Optimizing a Function**

Let’s solve an optimization problem with the function $$h ( x ) = - 2 x^{3} + 3 x^{2} + 1 2 x - 5$$. We want to find the local maxima and minima.

1.  **Find the First Derivative:**

    $$
    h ' ( x ) = - 6 x^{2} + 6 x + 12
    $$

2.  **Find the Critical Points:**

    $$
    {}- 6 x^{2} + 6 x + 12 = 0 \Longrightarrow - 6 \left( x^{2} - x - 2 \right) = 0 \Longrightarrow - 6 ( x - 2 ) ( x + 1 ) = 0 \Longrightarrow x = 2 \text{ or } x = - 1
    $$

3.  **Apply the Second Derivative Test:**

    $$
    h '' ( x ) = - 1 2 x + 6
    $$

    -   At $$x = 2$$:

        $$
        h '' ( 2 ) = - 12 ( 2 ) + 6 = - 24 + 6 = - 18 < 0 \Longrightarrow \text{There is a local maximum at } x = 2
        $$

    -   At $$x = - 1$$:

        $$
        h '' ( - 1 ) = - 12 ( - 1 ) + 6 = 12 + 6 = 18 > 0 \Longrightarrow \text{There is a local minimum at } x = - 1
        $$

4.  **Find the Function Values at the Critical Points:**

    $$
    h ( 2 ) = - 2 ( 2 )^{3} + 3 ( 2 )^{2} + 12 ( 2 ) - 5 = - 16 + 12 + 24 - 5 = 15
    $$

    $$
    h ( - 1 ) = - 2 ( - 1 )^{3} + 3 ( - 1 )^{2} + 12 ( - 1 ) - 5 = 2 + 3 - 12 - 5 = - 12
    $$

***
