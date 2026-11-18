"use client";

import { useRef } from "react";
import { Trash2, X } from "lucide-react";
import { deleteContent } from "./actions";

export function DeleteButton({ id, title }: { id: string; title: string }) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  return (
    <>
      <button
        type="button"
        onClick={() => dialogRef.current?.showModal()}
        className="inline-flex min-h-11 items-center gap-2 rounded-lg border border-[#d7aaa2] px-4 text-sm font-medium text-[#9d3f30] hover:bg-[#fff3f0]"
      >
        <Trash2 className="size-4" aria-hidden="true" />
        删除内容
      </button>
      <dialog
        ref={dialogRef}
        aria-labelledby="delete-title"
        className="m-auto w-[calc(100%-2rem)] max-w-md rounded-2xl border-0 p-6 text-[#18352e] shadow-2xl backdrop:bg-[#102f28]/55"
      >
        <div className="flex items-start justify-between gap-4">
          <h2 id="delete-title" className="text-xl font-semibold">
            确认删除这篇内容？
          </h2>
          <button
            type="button"
            onClick={() => dialogRef.current?.close()}
            className="grid size-9 place-items-center rounded-full hover:bg-[#eef1ed]"
            aria-label="关闭删除确认"
          >
            <X className="size-4" aria-hidden="true" />
          </button>
        </div>
        <p className="mt-4 text-sm leading-7 text-[#64716c]">
          “{title}”将从数据库中永久删除，此操作无法撤销。若只是暂时下线，请返回并改为草稿。
        </p>
        <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={() => dialogRef.current?.close()}
            className="min-h-11 rounded-lg border border-[#cbd4ce] px-4 text-sm"
          >
            取消
          </button>
          <form action={deleteContent}>
            <input type="hidden" name="id" value={id} />
            <button
              type="submit"
              className="min-h-11 w-full rounded-lg bg-[#9d3f30] px-4 text-sm font-medium text-white sm:w-auto"
            >
              确认永久删除
            </button>
          </form>
        </div>
      </dialog>
    </>
  );
}
