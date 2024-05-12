import React, { useCallback, useState } from "react";
import { AvatarImage, AvatarFallback, Avatar } from "./components/ui/avatar";
import CodeMirror from '@uiw/react-codemirror';
import { javascript } from '@codemirror/lang-javascript';
import { monokaiDimmed } from '@uiw/codemirror-theme-monokai-dimmed';

import { Button } from "./components/ui/button";
import { Input } from "./components/ui/input";
import { AssistantMessage, AutoDebugContext, Message, UserMessage } from './model'

type ChatProps = {
	messages: Message[];
	onSendMessage: (message: string) => void;
};

export default function Chat({ messages: chatMessages, onSendMessage }: ChatProps) {
	const [input, setInput] = useState<string>("");
	// const [chatMessages, setChatMessages] = useState<Message[]>(messages);

	const onSubmit = useCallback(
		(event: React.FormEvent<HTMLFormElement>) => {
			event.preventDefault();
			if (!input.trim()) return;
			const newUserMessage: UserMessage = { type: "user", text: input };
			// setChatMessages([...chatMessages, newUserMessage]);
			onSendMessage(newUserMessage.text); // Pass only the text of the new message
			setInput("");
		},
		[input, chatMessages, onSendMessage],
	);

	return (
		<div className="flex h-screen w-full flex-col">
			{/* Header and other components remain unchanged */}
			<div className="flex-1 overflow-auto p-4">
				{chatMessages.map((message, index) => (
					<div
						key={index}
						className={`flex ${
							message.type === "user" ? "justify-end" : "items-start"
						} gap-3 mb-4`}
					>
						{message.type === "assistant" && (
							<Avatar className="h-8 w-8">
								<AvatarImage alt="Assistant" src="/avatar.jpg" />
								<AvatarFallback>AI</AvatarFallback>
							</Avatar>
						)}
						<div className="max-w-[75%] space-y-2">
							<div
								className={`rounded-lg ${
									message.type === "user" ? "bg-blue-500" : "bg-gray-900"
								} p-1 text-white`}
							>
								<p>{message.text}</p>

                {message.type === 'assistant' && message.context && (
                  <ShowAutoDebugging context={message.context} />
                )}
							</div>
						</div>
					</div>
				))}
			</div>
			<div className="border-t border-gray-200 bg-white px-4 py-3 dark:border-gray-800 dark:bg-gray-950">
				<form onSubmit={onSubmit}>
					<div className="flex items-center gap-2">
						<Input
							className="flex-1 bg-transparent focus:outline-none"
							placeholder="Type your message..."
							type="text"
							value={input}
							onChange={(e) => setInput(e.target.value)}
						/>
						<Button
							className="text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800"
							size="icon"
							type="submit"
							variant="ghost"
						>
							<SendIcon className="h-5 w-5" />
						</Button>
					</div>
				</form>
			</div>
		</div>
	);
}

function ShowAutoDebugging({ context }: { context: AutoDebugContext }): React.ReactNode {
  const { history } = context;
  const lastHistoryItem = history[history.length - 1];
  const newCode = lastHistoryItem.code;

  return <div>
    <div>Count: {history.length}</div>
    <CodeMirror
      value={newCode}
      height="600px"
      extensions={[javascript({ jsx: true })]}
      theme={monokaiDimmed}
    />
    <pre className="whitespace-pre-wrap">
      {lastHistoryItem.result?.stdout}
    </pre>
    <pre className="whitespace-pre-wrap">
      {lastHistoryItem.result?.stderr}
    </pre>
    <pre className="whitespace-pre-wrap">
      {lastHistoryItem.analysis}
    </pre>
    <div>
      {lastHistoryItem.status} - {lastHistoryItem.reason}
    </div>
    {/* <pre>
      {JSON.stringify(lastHistoryItem, null, 2)}
    </pre> */}
  </div>;
}

function SendIcon(props: any) {
	return (
		<svg
			{...props}
			xmlns="http://www.w3.org/2000/svg"
			width="24"
			height="24"
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			strokeWidth="2"
			strokeLinecap="round"
			strokeLinejoin="round"
		>
			<path d="m22 2-7 20-4-9-9-4Z" />
			<path d="M22 2 11 13" />
		</svg>
	);
}