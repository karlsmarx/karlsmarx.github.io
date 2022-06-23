const terminal = document.getElementById("terminal");

terminal.addEventListener("keypress", (e) => {
	if (e.keyCode === 13) {
		getCommand();
		e.preventDefault();
	}
});

const help = () => {
	commands.forEach((command) => {
		if (!command.easter) {
			let text = `\n${command.inputs.join(", ")}\n${command.text}\n`;
			if (command.modifiers) {
				text += "Op&ccedil;&otilde;es: \n";
				command.modifiers.forEach((modifier) => {
					text += `  ${modifier.command}    ${modifier.text}\n`;
				});
			}

			printLine(text);
		}
	});
}

const about = (options) => {
	const about = document.getElementById("about");
	(options.includes("-p")) ? printLine(about.innerText) : about.scrollIntoView();
};

const skills = (options) => {
	const skills = document.getElementById("skills");
	(options.includes("-p")) ? printLine(skills.innerText) : skills.scrollIntoView();
};

const blog = () => {
	const blog = window.open("https://medium.com/@iho", "_blank");
	blog.focus();
};

const clear = () => {
	terminal.innerHTML = "";
};

const darkMode = () => {
	const allElements = document.querySelectorAll("body *");
	allElements.forEach((element) => {
		const style = getComputedStyle(element);

		// Get all blue or white and set to black
		if (style.color == "rgb(5, 157, 222)") element.style.color = "#ffffff";
		if (style.color == "rgb(0, 0, 0)") element.style.color = "#ffffff";
		if (style.background.includes("(5, 157, 222)") || style.background.includes("(255, 255, 255)")) {
			element.style.backgroundColor = "#000000"
			element.style.color = "#ffffff";
		}
	});

	// Change cards from skills
	const skillsDescriptions = document.querySelectorAll(".skill-image__card-description");
	skillsDescriptions.forEach((card) => card.style.color = "#059dde");

	// Change skills div and image
	const skillsContainer = document.querySelector("#skills");
	const skillsImage = document.querySelector(".skill-image");
	skillsContainer.style.backgroundColor = "#000000";
	skillsImage.style.background = "#000000";

	// Apply filter to resume image
	const resumeImage = document.querySelector(".resume-image img");
	resumeImage.src = "img/hacker.png";
	resumeImage.style.filter = "invert(57%) sepia(65%) saturate(4803%) hue-rotate(168deg) brightness(95%) contrast(96%)";
};

const fluffy = () => {
	const fluffy = window.open("https://www.youtube.com/watch?v=qRC4Vk6kisY", "_blank");
	fluffy.focus();
};

const roll = () => {
	document.getElementsByTagName("body")[0].className = "roll";
};


const commands = [
	{
		inputs: ["help", "h"],
		text: "Exibe a ajuda",
		function: help,
	}, {
		inputs: ["blog", "b"],
		text: "Abre meu blog em uma nova janela.",
		function: blog,
	}, {
		easter: true,
		inputs: ["dark-mode"],
		text: "Muda o site para darkmode.",
		function: darkMode,
	}, {
		inputs: ["about", "a"],
		modifiers: [
			{ command: "-p", text: "Imprime o texto no terminal."}
		],
		text: "Vai at&eacute; a sess&atilde;o sobre mim.",
		function: about,
	}, {
		inputs: ["skills", "s"],
		modifiers: [
			{ command: "-p", text: "Imprime o texto no terminal."}
		],
		text: "Vai at&eacute; a sess&atilde;o skills.",
		function: skills,
	}, {
		inputs: ["clear"],
		text: "Limpa o terminal.",
		function: clear,
	}, {
		easter: true,
		inputs: ["roll"],
		text: "Gira todo o site.",
		function: roll,
	}, {
		easter: true,
		inputs: ["fluffy"],
		text: "Abre o video mais fofo da internet.",
		function: fluffy,
	},
];

const printLine = (text = "Comando n&atilde;o encontrado.") => {
	const line = document.createElement("pre");

	// Chunk paragraphs to auto break lines qith the terminal behaviour
	const chunks = [];
	const lines = text.split("\n");

	// Iterate over lines and and to the slices that has the right size
	let chunkSize = 30;
	if (window.innerWidth > 798) chunkSize = 45;
	lines.forEach((line) => {
		// An interessant thing is that if the string ends exactly before,
		// the split returns a empty string, that will be a line-break
		for (let i = 0; i <= line.length; i += chunkSize) {
			chunks.push(line.slice(i, i + chunkSize));
		}
	})

	// Join all the chunks with the right line
	line.innerHTML = chunks.join("\n");

	terminal.appendChild(line);
};

const newLine = () => {
	const newLine = document.createElement("pre");
	newLine.innerHTML = "$: ";

	terminal.appendChild(newLine);
};

const goToEnd = () => {
	document.execCommand('selectAll', false, null);
	document.getSelection().collapseToEnd();

	terminal.scrollTop = terminal.scrollHeight;
};

const getCommand = () => {
	const [, ...input] = terminal.lastElementChild.innerHTML.split(" ");
	if (input[0]) {
		const result = commands.find((command) => {
			if (command.inputs.includes(input[0])) return true;
			return false;
		});

		if (!result) {
			printLine();
			newLine();
			goToEnd();

			return false;
		}

		if (result.modifiers) {
			const options = input.filter((option) => {
				return result.modifiers.find((modifier) => modifier.command === option);
			});

			result.function(options);
		} else {
			result.function();
		}
	}

	newLine();
	goToEnd();
}
