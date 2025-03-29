import { useEditor, EditorContent, BubbleMenu } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import TextStyle from "@tiptap/extension-text-style";
import { useState } from "react";
import Color from "@tiptap/extension-color";
import FontFamily from "@tiptap/extension-font-family";
import { useLocation, useNavigate } from "react-router-dom";

const Editor = () => {
  const { state } = useLocation();
  const { content } = state || {};

  const navigate = useNavigate();
  const [color, setColor] = useState("#000000");
  const [font, setFont] = useState("Arial");

  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({
        placeholder: "Start typing here...",
      }),
      TextStyle,
      Color,
      FontFamily.configure({
        types: ["textStyle"],
      }),
    ],
    content: content ? content : "<p>Welcome to the editor!</p>",
  });

  const getContent = () => {
    if (editor) {
      const content = editor.getText();
      navigate("/blog-post", { state: { content } });
    }
  };

  const getEditedContent = () => {
    if (editor) {
      const editedContent = editor.getText();
      navigate("/update-blog", { state: { editedContent } });
    }
  };

  const applyColor = () => {
    if (editor) {
      editor.chain().focus().setColor(color).run();
    }
  };

  const applyFont = () => {
    if (editor) {
      editor.chain().focus().setFontFamily(font).run();
    }
  };

  return (
    <div className="editor-container p-4 bg-gray-100 rounded shadow-md">
      <header className="editor-header mb-4">
        <h1 className="text-2xl font-bold text-center">Content</h1>
      </header>
      {editor && (
        <BubbleMenu
          editor={editor}
          className="bubble-menu bg-white border border-gray-300 rounded shadow-md p-4 flex flex-col space-y-4">
          <div className="formatting-tools flex space-x-2">
            <button
              onClick={() => editor.chain().focus().toggleBold().run()}
              className={`menu-item px-3 py-1 rounded cursor-pointer ${
                editor.isActive("bold")
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200 text-gray-700"
              }`}>
              Bold
            </button>
            <button
              onClick={() => editor.chain().focus().toggleItalic().run()}
              className={`menu-item px-3 py-1 rounded cursor-pointer ${
                editor.isActive("italic")
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200 text-gray-700"
              }`}>
              Italic
            </button>
            <button
              onClick={() => editor.chain().focus().toggleStrike().run()}
              className={`menu-item px-3 py-1 rounded cursor-pointer ${
                editor.isActive("strike")
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200 text-gray-700"
              }`}>
              Strike
            </button>
          </div>
          <div className="color-tools flex items-center space-x-2">
            <label className="text-sm text-gray-700">Text Color:</label>
            <input
              type="color"
              value={color}
              onChange={(e) => setColor(e.target.value)}
              className="color-picker cursor-pointer"
            />
            <button
              onClick={applyColor}
              className="menu-item px-3 py-1 rounded bg-gray-200 text-gray-700 cursor-pointer">
              Apply
            </button>
          </div>
          <div className="font-tools flex items-center space-x-2">
            <label className="text-sm text-gray-700">Font:</label>
            <select
              value={font}
              onChange={(e) => setFont(e.target.value)}
              className="font-picker px-3 py-1 rounded bg-gray-200 text-gray-700 cursor-pointer">
              <option value="Arial">Arial</option>
              <option value="Georgia">Georgia</option>
              <option value="Times New Roman">Times New Roman</option>
              <option value="Courier New">Courier New</option>
              <option value="Verdana">Verdana</option>
            </select>
            <button
              onClick={applyFont}
              className="menu-item px-3 py-1 rounded bg-gray-200 text-gray-700 cursor-pointer">
              Apply
            </button>
          </div>
        </BubbleMenu>
      )}
      <EditorContent
        editor={editor}
        className="editor-content border border-gray-300 rounded p-2 bg-white h-96 overflow-auto"
      />
      {editor && (
        <div className="character-count mt-2 text-sm text-gray-500">
          Character count: {editor.getCharacterCount()}
        </div>
      )}

      {content ? (
        <div
          onClick={() => {
            getEditedContent();
          }}
          className="inline-block absolute right-5">
          <button className="btn btn-soft btn-success">Edit</button>
        </div>
      ) : (
        <div
          onClick={() => {
            getContent();
          }}
          className="inline-block absolute right-5">
          <button className="btn btn-soft btn-success">Done</button>
        </div>
      )}
      <footer className="editor-footer mt-4 text-center text-sm text-gray-500">
        <p>Powered by Tiptap</p>
      </footer>
    </div>
  );
};

export default Editor;
