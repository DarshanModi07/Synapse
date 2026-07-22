import { useEffect, useState } from "react";

import {
  Sparkles,
  Wand2,
  Check,
  LoaderCircle,
  X,
} from "lucide-react";

import { theme } from "@/lib/theme";

import {
  getDepartments,
} from "@/services/department.service";

import {
  suggestTeams,
} from "@/services/team.service";

const AITeamSuggestionModal = ({
  open,
  onClose,
  workspaceId,
  onCreate,
}) => {

  const [departments, setDepartments] =
    useState([]);

  const [departmentId, setDepartmentId] =
    useState("");

  const [departmentName, setDepartmentName] =
    useState("");

  const [loadingDepartments, setLoadingDepartments] =
    useState(false);

  const [generating, setGenerating] =
    useState(false);

  const [creating, setCreating] =
    useState(false);

  const [suggestions, setSuggestions] =
    useState([]);

  const [selected, setSelected] =
    useState([]);

  useEffect(() => {

    if (!open || !workspaceId) return;

    fetchDepartments();

  }, [open, workspaceId]);

  const fetchDepartments = async () => {

    try {

      setLoadingDepartments(true);

      const response =
        await getDepartments(
          workspaceId
        );

      setDepartments(
        response.data || []
      );

    }
    catch (err) {

      console.error(err);

    }
    finally {

      setLoadingDepartments(false);

    }

  };

  const handleGenerate =
    async () => {

      if (!departmentId) return;

      try {

        setGenerating(true);

        const response =
          await suggestTeams(
            departmentId
          );

        const teams =
          response.data.teams || [];

        setSuggestions(teams);

        setSelected(
          teams.map((_, index) => index)
        );

      }
      catch (err) {

        console.error(err);

      }
      finally {

        setGenerating(false);

      }

    };

  const toggleSuggestion =
    (index) => {

      if (
        selected.includes(index)
      ) {

        setSelected(
          selected.filter(
            i => i !== index
          )
        );

      }
      else {

        setSelected([
          ...selected,
          index,
        ]);

      }

    };

  if (!open) return null;

    return (

    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md">

      <div
        className="relative w-full max-w-3xl rounded-3xl p-8"
        style={{
          background: "#13111C",
          border: "1px solid rgba(255,255,255,.08)",
        }}
      >

        {/* Header */}

        <div className="mb-8 flex items-center justify-between">

          <div>

            <h2
              className="flex items-center gap-3 text-3xl font-bold"
              style={{
                color: theme.text,
              }}
            >

              <Sparkles
                size={30}
                color={theme.primaryLight}
              />

              AI Team Suggestions

            </h2>

            <p
              className="mt-2"
              style={{
                color: theme.secondary,
              }}
            >
              Generate professional team suggestions
              for a department.
            </p>

          </div>

          <button
            onClick={onClose}
          >

            <X
              size={24}
              color={theme.secondary}
            />

          </button>

        </div>

        {/* Department */}

        <div className="mb-8">

          <label
            className="mb-2 block"
            style={{
              color: theme.secondary,
            }}
          >
            Department
          </label>

          <select

            value={departmentId}

            disabled={
              loadingDepartments ||
              generating
            }

            onChange={(e) => {

              setDepartmentId(
                e.target.value
              );

              const dept =
                departments.find(
                  d =>
                    d.id ===
                    e.target.value
                );

              setDepartmentName(
                dept?.name || ""
              );

            }}

            className="h-14 w-full rounded-xl px-4 outline-none"

            style={{
              background:
                "rgba(255,255,255,.05)",
              border:
                "1px solid rgba(255,255,255,.08)",
              color: theme.text,
            }}

          >

            <option value="">
              Select Department
            </option>

            {departments.map(
              (department) => (

                <option
                  key={department.id}
                  value={department.id}
                >
                  {department.name}
                </option>

              )
            )}

          </select>

        </div>

        {/* Generate */}

        <button

          onClick={handleGenerate}

          disabled={
            !departmentId ||
            generating
          }

          className="flex h-14 w-full items-center justify-center gap-3 rounded-2xl font-medium transition-all duration-300 hover:scale-[1.01] disabled:cursor-not-allowed disabled:opacity-60"

          style={{
            background:
              "linear-gradient(135deg,#7C3AED,#A78BFA)",
            color: "#fff",
          }}

        >

          {

            generating

              ?

              <>

                <LoaderCircle
                  size={20}
                  className="animate-spin"
                />

                Generating Teams...

              </>

              :

              <>

                <Wand2 size={20} />

                Generate AI Teams

              </>

          }

        </button>

        {/* AI Loading Overlay */}

        {

          generating && (

            <div className="absolute inset-0 flex flex-col items-center justify-center rounded-3xl bg-black/70 backdrop-blur-md">

              <div
                className="h-16 w-16 animate-spin rounded-full border-4 border-t-transparent"
                style={{
                  borderColor:
                    "rgba(167,139,250,.30)",
                  borderTopColor:
                    theme.primary,
                }}
              />

              <h3
                className="mt-8 text-center text-2xl font-semibold"
                style={{
                  color: theme.text,
                }}
              >
                AI is analyzing
              </h3>

              <p
                className="mt-2 px-6 text-center"
                style={{
                  color: theme.secondary,
                }}
              >
                Building the best team structure for
                {departmentName
                  ? ` ${departmentName}`
                  : " this department"}...
              </p>

            </div>

          )

        }

                {/* Suggestions */}

        {!generating && suggestions.length > 0 && (

          <>

            <div className="mt-8 flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">

              <div>

                <h3
                  className="text-2xl font-semibold"
                  style={{
                    color: theme.text,
                  }}
                >
                  Suggested Teams
                </h3>

                <p
                  className="mt-1"
                  style={{
                    color: theme.secondary,
                  }}
                >
                  Select the teams you want to create.
                </p>

              </div>

              <div className="flex w-full gap-3 sm:w-auto">

                <button

                  onClick={() =>
                    setSelected(
                      suggestions.map(
                        (_, index) => index
                      )
                    )
                  }

                  className="flex-1 rounded-xl px-4 py-2 text-sm transition sm:flex-none"

                  style={{
                    background:
                      "rgba(255,255,255,.05)",
                    border:
                      "1px solid rgba(255,255,255,.08)",
                    color: theme.text,
                  }}

                >

                  Select All

                </button>

                <button

                  onClick={() =>
                    setSelected([])
                  }

                  className="flex-1 rounded-xl px-4 py-2 text-sm transition sm:flex-none"

                  style={{
                    background:
                      "rgba(255,255,255,.05)",
                    border:
                      "1px solid rgba(255,255,255,.08)",
                    color: theme.text,
                  }}

                >

                  Clear

                </button>

              </div>

            </div>

            <div className="mt-6 max-h-[420px] space-y-4 overflow-y-auto pr-2">

              {suggestions.map(
                (team, index) => {

                  const active =
                    selected.includes(index);

                  return (

                    <div

                      key={index}

                      onClick={() =>
                        toggleSuggestion(
                          index
                        )
                      }

                      className="cursor-pointer rounded-2xl p-5 transition-all duration-300 hover:scale-[1.01]"

                      style={{

                        background: active
                          ? "rgba(124,58,237,.15)"
                          : "rgba(255,255,255,.03)",

                        border: active
                          ? "1px solid rgba(167,139,250,.35)"
                          : "1px solid rgba(255,255,255,.08)",

                      }}

                    >

                      <div className="flex items-start justify-between">

                        <div>

                          <h4
                            className="text-lg font-semibold"
                            style={{
                              color: theme.text,
                            }}
                          >
                            {team.name}
                          </h4>

                          <p
                            className="mt-2 leading-7"
                            style={{
                              color: theme.secondary,
                            }}
                          >
                            {team.description}
                          </p>

                        </div>

                        <div

                          className="flex h-8 w-8 items-center justify-center rounded-full"

                          style={{
                            background: active
                              ? theme.primary
                              : "rgba(255,255,255,.08)",
                          }}

                        >

                          {active && (
                            <Check
                              size={18}
                              color="#fff"
                            />
                          )}

                        </div>

                      </div>

                    </div>

                  );

                }
              )}

            </div>

          </>

        )}

                {/* Footer */}

        {!generating &&
          suggestions.length > 0 && (

            <div className="mt-8 flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">

              <div>

                <p
                  style={{
                    color: theme.secondary,
                  }}
                >
                  {selected.length} of{" "}
                  {suggestions.length} selected
                </p>

              </div>

              <div className="flex w-full gap-4 sm:w-auto">

                <button

                  onClick={onClose}

                  disabled={creating}

                  className="flex-1 rounded-xl px-6 py-3 transition-all duration-300 hover:scale-[1.02] sm:flex-none"

                  style={{
                    background:
                      "rgba(255,255,255,.05)",
                    border:
                      "1px solid rgba(255,255,255,.08)",
                    color: theme.text,
                  }}

                >

                  Cancel

                </button>

                <button

                  disabled={
                    creating ||
                    selected.length === 0
                  }

                  onClick={async () => {

                    try {

                      setCreating(true);

                      for (const index of selected) {

                        const suggestion =
                          suggestions[index];

                        await onCreate({

                          departmentId,

                          name:
                            suggestion.name,

                          leaderId: null,

                        });

                      }

                      setSuggestions([]);

                      setSelected([]);

                      setDepartmentId("");

                      setDepartmentName("");

                      onClose();

                    }
                    catch (err) {

                      console.error(err);

                    }
                    finally {

                      setCreating(false);

                    }

                  }}

                  className="flex-1 rounded-xl px-8 py-3 transition-all duration-300 hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-60 sm:flex-none"

                  style={{
                    background:
                      "linear-gradient(135deg,#7C3AED,#A78BFA)",
                    color: "#fff",
                    boxShadow:
                      "0 10px 28px rgba(124,58,237,.30)",
                  }}

                >

                  {

                    creating

                      ? "Creating..."

                      : `Create ${selected.length} Team${selected.length !== 1 ? "s" : ""}`

                  }

                </button>

              </div>

            </div>

          )}

      </div>

    </div>

  );

};

export default AITeamSuggestionModal;