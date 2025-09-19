# Contributing to GasRápido

First off, thank you for considering contributing to GasRápido! It's people like you that make GasRápido such a great platform.

## Code of Conduct

This project and everyone participating in it is governed by our Code of Conduct. By participating, you are expected to uphold this code. Please report unacceptable behavior to [project-email@example.com].

## How Can I Contribute?

### Reporting Bugs

This section guides you through submitting a bug report for GasRápido. Following these guidelines helps maintainers and the community understand your report, reproduce the behavior, and find related reports.

**Before Submitting A Bug Report**

- Check the documentation for tips on troubleshooting
- Determine which repository the problem should be reported in
- Check if the issue has already been reported

**How Do I Submit A (Good) Bug Report?**

Bugs are tracked as GitHub issues. Create an issue and provide the following information:

- Use a clear and descriptive title
- Describe the exact steps which reproduce the problem
- Provide specific examples to demonstrate the steps
- Describe the behavior you observed after following the steps
- Explain which behavior you expected to see instead and why
- Include screenshots and animated GIFs if possible
- Include details about your configuration and environment

### Suggesting Enhancements

This section guides you through submitting an enhancement suggestion for GasRápido, including completely new features and minor improvements to existing functionality.

**Before Submitting An Enhancement Suggestion**

- Check if the enhancement has already been suggested
- Determine which repository the enhancement should be suggested in

**How Do I Submit A (Good) Enhancement Suggestion?**

Enhancement suggestions are tracked as GitHub issues. Create an issue and provide the following information:

- Use a clear and descriptive title
- Provide a step-by-step description of the suggested enhancement
- Provide specific examples to demonstrate the steps
- Describe the current behavior and explain which behavior you expected to see instead
- Include screenshots and animated GIFs if possible
- Explain why this enhancement would be useful to most GasRápido users

### Your First Code Contribution

Unsure where to begin contributing to GasRápido? You can start by looking through these `beginner` and `help-wanted` issues:

- `beginner` - issues which should only require a few lines of code, and a test or two
- `help-wanted` - issues which should be a bit more involved than `beginner` issues

### Pull Requests

The process described here has several goals:

- Maintain GasRápido's quality
- Fix problems that are important to users
- Engage the community in working toward the best possible GasRápido
- Enable a sustainable system for GasRápido's maintainers to review contributions

Please follow these steps to have your contribution considered by the maintainers:

1. Follow all instructions in the template
2. Follow the styleguides
3. After you submit your pull request, verify that all status checks are passing

While the prerequisites above must be satisfied prior to having your pull request reviewed, the reviewer(s) may ask you to complete additional design work, tests, or other changes before your pull request can be ultimately accepted.

## Styleguides

### Git Commit Messages

- Use the present tense ("Add feature" not "Added feature")
- Use the imperative mood ("Move cursor to..." not "Moves cursor to...")
- Limit the first line to 72 characters or less
- Reference issues and pull requests liberally after the first line
- When only changing documentation, include `[ci skip]` in the commit title

### JavaScript/TypeScript Styleguide

All JavaScript and TypeScript must adhere to our ESLint and Prettier configurations.

- Prefer the object spread operator (`{...anotherObj}`) to `Object.assign()`
- Inline `export`s with expressions whenever possible
- Use TypeScript for all new code

### CSS Styleguide

- Use Tailwind CSS classes whenever possible
- When custom CSS is needed, use CSS modules
- Follow the BEM naming convention for custom CSS classes

### Documentation Styleguide

- Use Markdown for documentation
- Reference methods and classes in markdown with the brackets notation: `[AuthController]`
- Reference parameters and objects with inline code notation: `userId`

## Additional Notes

### Issue and Pull Request Labels

This section lists the labels we use to help us track and manage issues and pull requests.

#### Type of Issue and Issue State

- `bug` - Issues that are bugs
- `enhancement` - Issues that are feature requests
- `documentation` - Issues that are documentation related
- `beginner` - Issues that are good for beginners
- `help-wanted` - Issues that need assistance from the community

#### Topic Categories

- `security` - Issues related to security
- `performance` - Issues related to performance
- `ui` - Issues related to user interface
- `api` - Issues related to APIs
- `database` - Issues related to database

Thank you for reading through our contributing guidelines!