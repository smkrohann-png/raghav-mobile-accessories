import glob
import json
import os

workspace_dir = "/Users/mac/raghav-mobile-accessories"
logs = glob.glob("/Users/mac/.gemini/antigravity/brain/*/.system_generated/logs/transcript_full.jsonl")

# sort by timestamp
def get_creation_time(log_path):
    with open(log_path, 'r') as f:
        first_line = f.readline()
        try:
            return json.loads(first_line).get('created_at', '')
        except:
            return ''

logs.sort(key=get_creation_time)

for log_path in logs:
    with open(log_path, 'r') as f:
        for line in f:
            try:
                step = json.loads(line)
            except:
                continue
            
            if 'tool_calls' in step:
                for tool in step['tool_calls']:
                    name = tool.get('name')
                    args = tool.get('args', {})
                    
                    target_file = args.get('TargetFile', '')
                    if not target_file.startswith(workspace_dir):
                        continue
                        
                    if name == "write_to_file":
                        content = args.get('CodeContent', '')
                        os.makedirs(os.path.dirname(target_file), exist_ok=True)
                        with open(target_file, 'w') as out:
                            out.write(content)
                        print(f"Restored {target_file}")
                        
                    elif name == "replace_file_content":
                        target = args.get('TargetContent', '')
                        replacement = args.get('ReplacementContent', '')
                        if os.path.exists(target_file):
                            with open(target_file, 'r') as out:
                                content = out.read()
                            content = content.replace(target, replacement)
                            with open(target_file, 'w') as out:
                                out.write(content)
                            print(f"Replaced in {target_file}")
                            
                    elif name == "multi_replace_file_content":
                        chunks = args.get('ReplacementChunks', [])
                        if os.path.exists(target_file):
                            with open(target_file, 'r') as out:
                                content = out.read()
                            if isinstance(chunks, str):
                                chunks = json.loads(chunks)
                            for chunk in chunks:
                                target = chunk.get('TargetContent', '')
                                replacement = chunk.get('ReplacementContent', '')
                                content = content.replace(target, replacement)
                            with open(target_file, 'w') as out:
                                out.write(content)
                            print(f"Multi-replaced in {target_file}")

print("Recovery complete.")
